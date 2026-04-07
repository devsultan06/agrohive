import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetCurrentUser } from '../common/decorators/get-user.decorator';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('history/:targetUserId')
  async getChatHistory(
    @GetCurrentUser('id') currentUserId: string,
    @Param('targetUserId') targetUserId: string,
  ) {
    // Generate deterministic room ID (same as gateway)
    const roomId = [currentUserId, targetUserId].sort().join('_');
    const messages = await this.chatService.getMessages(roomId);
    
    // Map them back for client expected format if necessary or return raw
    return messages.reverse(); // Prisma fetched 'desc', we need 'asc' for the UI chat flow
  }

  @Get('conversations')
  async getConversations(@GetCurrentUser('id') currentUserId: string) {
    return this.chatService.getConversations(currentUserId);
  }
}
