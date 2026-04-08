import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationType } from '@prisma/client';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly firebase: FirebaseService,
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

    // Check if user has fcmToken and send push notification
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { fcmToken: true },
    });

    if (user?.fcmToken) {
      await this.firebase.sendPushNotification(
        user.fcmToken,
        data.title,
        data.message,
        data.metadata,
      );
      this.logger.log(`Push notification sent to user ${userId}`);
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

    // 1. Get all users
    const users = await this.prisma.user.findMany({
      select: { id: true, fcmToken: true },
    });

    // 2. Create database notifications (bulk)
    await this.prisma.notification.createMany({
      data: users.map((u) => ({
        ...data,
        userId: u.id,
      })),
    });

    // 3. Send push notifications to those with tokens
    const tokens = users.map((u) => u.fcmToken).filter((t) => !!t) as string[];
    if (tokens.length > 0) {
      // Note: In production, use Firebase's sendMulticast or batches
      await this.firebase.sendMulticastNotification(
        tokens,
        data.title,
        data.message,
        data.metadata,
      );
      this.logger.log(`Push notifications sent to ${tokens.length} users`);
    }

    return { total: users.length, pushes: tokens.length };
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
