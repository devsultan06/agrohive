import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async saveMessage(senderId: string, receiverId: string, content: string, roomId: string) {
    return this.prisma.message.create({
      data: {
        content,
        senderId,
        receiverId,
        roomId,
      },
      include: {
        sender: {
          select: { id: true, fullName: true, avatarUrl: true },
        },
      },
    });
  }

  async getMessages(roomId: string, limit = 50) {
    return this.prisma.message.findMany({
      where: { roomId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        sender: {
          select: { id: true, fullName: true, avatarUrl: true },
        },
      },
    });
  }

  async getConversations(userId: string) {
    // Find all messages involving the user
    const messages = await this.prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      orderBy: { createdAt: 'desc' },
      include: {
        sender: { select: { id: true, fullName: true, avatarUrl: true } },
        receiver: { select: { id: true, fullName: true, avatarUrl: true } },
      },
    });

    // Extract unique rooms and their last message
    const conversations = new Map<string, any>();

    for (const msg of messages) {
      if (!conversations.has(msg.roomId)) {
        // Determine the 'other' user
        const otherUser = msg.senderId === userId ? msg.receiver : msg.sender;
        conversations.set(msg.roomId, {
          roomId: msg.roomId,
          lastMessage: msg.content,
          lastMessageAt: msg.createdAt,
          isRead: msg.isRead,
          otherUser,
        });
      }
    }

    return Array.from(conversations.values());
  }
}
