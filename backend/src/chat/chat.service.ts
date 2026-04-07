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
}
