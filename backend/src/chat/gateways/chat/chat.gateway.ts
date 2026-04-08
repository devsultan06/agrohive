import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from '../../chat.service';
import { NotificationsService } from '../../../notifications/notifications.service';
import { NotificationType } from '@prisma/client';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // Map to store connected users: userId -> socketId
  private activeUsers = new Map<string, string>();

  constructor(
    private readonly jwtService: JwtService,
    private readonly chatService: ChatService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token || client.handshake.headers.authorization?.split(' ')[1];
      if (!token) {
        client.disconnect();
        return;
      }

      const decoded = this.jwtService.verify(token);
      const userId = decoded.sub;
      client.data.user = { id: userId, fullName: decoded.fullName }; 

      // Add to active users
      this.activeUsers.set(userId, client.id);
      
      console.log(`Client connected: ${client.id} (User: ${userId})`);
    } catch (error: any) {
      console.log('WS Connection error:', error.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    if (client.data.user?.id) {
      this.activeUsers.delete(client.data.user.id);
      console.log(`Client disconnected: ${client.id} (User: ${client.data.user.id})`);
    }
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { targetUserId: string },
  ) {
    const userId1 = client.data.user.id;
    const userId2 = data.targetUserId;
    
    // Create deterministic room ID exactly as the user specified
    const roomId = [userId1, userId2].sort().join('_');
    
    client.join(roomId);
    console.log(`User ${userId1} joined room: ${roomId}`);
    
    return { event: 'joinedRoom', data: { roomId } };
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { targetUserId: string; content: string },
  ) {
    const senderId = client.data.user.id;
    const { targetUserId, content } = payload;

    const roomId = [senderId, targetUserId].sort().join('_');

    // 1. Save to DB
    const message = await this.chatService.saveMessage(
      senderId,
      targetUserId,
      content,
      roomId,
    );

    // 2. Emit to the room
    this.server.to(roomId).emit('receiveMessage', message);

    // 3. Fallback to Push Notification if target user is offline
    if (!this.activeUsers.has(targetUserId)) {
      try {
        await this.notificationsService.create(targetUserId, {
          type: NotificationType.COMMENT, // Using COMMENT or SYSTEM as a base for chat for now
          title: `New Message from ${client.data.user.fullName || 'Farmer'}`,
          message: content.length > 50 ? `${content.substring(0, 50)}...` : content,
          metadata: {
            type: 'chat',
            senderId,
            roomId,
          },
        });
        console.log(`Push notification fallback sent to offline user: ${targetUserId}`);
      } catch (error: any) {
        console.error('Failed to send push notification fallback:', error.message);
      }
    }

    return { event: 'messageSent', data: message };
  }

  @SubscribeMessage('checkStatus')
  handleCheckStatus(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { targetUserId: string },
  ) {
    const isOnline = this.activeUsers.has(data.targetUserId);
    return { event: 'statusResponse', data: { isOnline } };
  }
}
