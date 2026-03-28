import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcrypt';

import { UserRole } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
    private readonly notifications: NotificationsService,
  ) {}

  async findAll(query?: {
    verified?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }) {
    const { verified, search, limit = 10, offset = 0 } = query || {};
    this.logger.log(
      `Admin feting users — verified: ${verified || 'all'}, search: ${search || 'none'}`,
    );

    return this.prisma.user.findMany({
      take: Number(limit),
      skip: Number(offset),
      where: {
        role: UserRole.USER,
        ...(verified === 'true'
          ? { isVerified: true }
          : verified === 'false'
            ? { isVerified: false }
            : {}),
        ...(search
          ? {
              OR: [
                { fullName: { contains: search, mode: 'insensitive' } },
                { username: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        _count: {
          select: { posts: true, followers: true },
        },
      },
    });
  }

  async getDashboardRecentUsers(limit = 4) {
    this.logger.log(`Fetching ${limit} recent users for dashboard`);
    return this.prisma.user.findMany({
      where: { role: UserRole.USER },
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        fullName: true,
        email: true,
        isVerified: true,
        avatarUrl: true,
        _count: {
          select: { posts: true, favorites: true },
        },
      },
    });
  }

  async getGeneralStats() {
    this.logger.log('Calculating general dashboard highlights');
    const [totalUsers, totalPosts, activeListings, ordersData] =
      await Promise.all([
        this.prisma.user.count({ where: { role: UserRole.USER } }),
        this.prisma.post.count(),
        this.prisma.product.count({ where: { isActive: true } }),
        this.prisma.order.aggregate({
          where: { paymentStatus: 'SUCCESS' },
          _count: true,
          _sum: { totalAmount: true },
        }),
      ]);

    this.logger.log(
      `General stats: users=${totalUsers}, posts=${totalPosts}, products=${activeListings}, orders=${ordersData._count}, revenue=${ordersData._sum?.totalAmount}`,
    );

    return {
      totalUsers,
      totalPosts,
      activeListings,
      totalOrders: ordersData._count ?? 0,
      totalRevenue: Number(ordersData._sum?.totalAmount) || 0,
    };
  }

  async toggleVerification(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { isVerified: !user.isVerified },
    });

    this.logger.log(
      `User ${userId} verification toggled to: ${updatedUser.isVerified}`,
    );
    return updatedUser;
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: { followers: true, following: true },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Exclude sensitive fields
    const { password, refreshToken, ...result } = user;
    return result;
  }

  async updateMe(
    userId: string,
    dto: UpdateUserDto,
    image?: Express.Multer.File,
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    let avatarUrl = dto.avatarUrl || user.avatarUrl;

    if (image) {
      const uploadResult = await this.cloudinary.uploadFile(image);
      avatarUrl = uploadResult.secure_url;
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        fullName: dto.fullName,
        phone: dto.phone,
        location: dto.location,
        bio: dto.bio,
        fcmToken: dto.fcmToken,
        avatarUrl,
      },
      include: {
        _count: {
          select: { followers: true, following: true },
        },
      },
    });

    const { password, refreshToken, ...result } = updatedUser;

    this.logger.log(`Profile updated for user: ${userId}`);

    return {
      message: 'Profile updated successfully',
      user: result,
    };
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.password) {
      throw new BadRequestException(
        'This account does not have a password (logged in via Google).',
      );
    }

    const isPasswordValid = await bcrypt.compare(
      dto.currentPassword,
      user.password!,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid current password');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    await this.notifications.create(user.id, {
      type: 'SYSTEM',
      title: 'Password Changed 🔒',
      message: 'Your password has been successfully updated.',
      metadata: { screen: 'Notifications' },
    });

    this.logger.log(`Password changed for user: ${userId}`);

    return { message: 'Password changed successfully' };
  }

  async deleteMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.delete({
      where: { id: userId },
    });

    this.logger.warn(`Account deleted: ${userId}`);

    return { message: 'Account deleted successfully' };
  }

  async getUserById(targetUserId: string, currentUserId?: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: targetUserId },
      include: {
        _count: {
          select: { followers: true, following: true },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    let isFollowing = false;
    if (currentUserId) {
      const follow = await this.prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: currentUserId,
            followingId: targetUserId,
          },
        },
      });
      isFollowing = !!follow;
    }

    const { password, refreshToken, ...result } = user;
    return {
      ...result,
      isFollowing,
    };
  }

  async toggleFollow(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new BadRequestException('You cannot follow yourself');
    }

    const targetUser = await this.prisma.user.findUnique({
      where: { id: followingId },
    });

    if (!targetUser) {
      throw new NotFoundException('User to follow not found');
    }

    const existingFollow = await this.prisma.follow.findUnique({
      where: {
        followerId_followingId: { followerId, followingId },
      },
    });

    if (existingFollow) {
      await this.prisma.follow.delete({
        where: { followerId_followingId: { followerId, followingId } },
      });
      this.logger.log(`User ${followerId} unfollowed ${followingId}`);
      return { following: false };
    } else {
      await this.prisma.follow.create({
        data: { followerId, followingId },
      });

      // Fetch follower's name for notification
      const follower = await this.prisma.user.findUnique({
        where: { id: followerId },
        select: { fullName: true },
      });

      // Create notification
      await this.notifications.create(followingId, {
        type: 'FOLLOW',
        title: 'New Follower! 👤',
        message: `${follower?.fullName || 'Someone'} started following you.`,
        metadata: { user: { id: followerId }, screen: 'PublicProfile' },
      });

      return { following: true };
    }
  }
}
