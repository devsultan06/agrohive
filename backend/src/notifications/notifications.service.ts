import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationType } from '@prisma/client';
import { FirebaseService } from '../firebase/firebase.service';
import { TelegramService } from '../telegram/telegram.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly firebase: FirebaseService,
    private readonly telegram: TelegramService,
  ) {}

  async create(
    userId: string,
    data: {
      type: NotificationType;
      title: string;
      message: string;
      metadata?: any;
    },
  ) {
    const notification = await this.prisma.notification.create({
      data: {
        ...data,
        userId,
      },
    });

    this.logger.log(
      `Notification created: [${data.type}] "${data.title}" for user ${userId}`,
    );

    // Fetch user for both Push and Telegram tokens
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { fcmToken: true, telegramId: true },
    });

    // 1. Handle Firebase Push
    if (user?.fcmToken) {
      await this.firebase.sendPushNotification(
        user.fcmToken,
        data.title,
        data.message,
        data.metadata,
      );
      this.logger.log(`Push notification sent to user ${userId}`);
    }

    // 2. Handle Telegram Notification
    if (user?.telegramId) {
      const telegramMsg = `<b>${data.title}</b>\n\n${data.message}`;
      await this.telegram.sendMessage(user.telegramId, telegramMsg);
      this.logger.log(`Telegram notification sent to user ${userId}`);
    }

    return notification;
  }

  async notifyAll(data: {
    type: NotificationType;
    title: string;
    message: string;
    metadata?: any;
  }) {
    this.logger.log(`Sending system-wide notification: "${data.title}"`);

    const users = await this.prisma.user.findMany({
      select: { id: true, fcmToken: true, telegramId: true },
    });

    await this.prisma.notification.createMany({
      data: users.map((u) => ({
        ...data,
        userId: u.id,
      })),
    });

    // Push notifications
    const tokens = users.map((u) => u.fcmToken).filter((t) => !!t) as string[];
    if (tokens.length > 0) {
      await this.firebase.sendMulticastNotification(
        tokens,
        data.title,
        data.message,
        data.metadata,
      );
    }

    // Telegram notifications
    const telegramUsers = users.filter((u) => !!u.telegramId);
    for (const u of telegramUsers) {
      if (u.telegramId) {
        const telegramMsg = `<b>${data.title}</b>\n\n${data.message}`;
        await this.telegram.sendMessage(u.telegramId, telegramMsg);
      }
    }

    this.logger.log(`System-wide notification sent to ${users.length} users`);
    return { total: users.length, pushes: tokens.length, telegrams: telegramUsers.length };
  }

  async findAll(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(notificationId: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  async delete(notificationId: string, userId: string) {
    return this.prisma.notification.deleteMany({
      where: { id: notificationId, userId },
    });
  }

  async clearAll(userId: string) {
    const result = await this.prisma.notification.deleteMany({
      where: { userId },
    });
    this.logger.log(`Cleared ${result.count} notifications for user ${userId}`);
    return result;
  }
}
