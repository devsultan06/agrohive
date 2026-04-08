import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  UseGuards,
  Post,
  Body,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetCurrentUserId } from '../common/decorators/get-user.decorator';
import { SkipThrottle } from '@nestjs/throttler';

import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole, NotificationType } from '@prisma/client';

// Notifications are polled frequently — skip throttle
@SkipThrottle()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('admin/send')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MANAGER)
  async sendToAll(
    @Body('type') type: NotificationType,
    @Body('title') title: string,
    @Body('message') message: string,
    @Body('target') target: string,
  ) {
    if (target === 'all') {
      return this.notificationsService.notifyAll({ type, title, message });
    }
    // Handle other targets if needed (verified, new, etc.)
    return this.notificationsService.notifyAll({ type, title, message });
  }

  @Get()
  async findAll(@GetCurrentUserId() userId: string) {
    return this.notificationsService.findAll(userId);
  }

  @Patch(':id/read')
  async markAsRead(
    @Param('id') id: string,
    @GetCurrentUserId() userId: string,
  ) {
    return this.notificationsService.markAsRead(id, userId);
  }

  @Patch('read-all')
  async markAllAsRead(@GetCurrentUserId() userId: string) {
    return this.notificationsService.markAllAsRead(userId);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @GetCurrentUserId() userId: string) {
    return this.notificationsService.delete(id, userId);
  }

  @Delete()
  async clearAll(@GetCurrentUserId() userId: string) {
    return this.notificationsService.clearAll(userId);
  }
}
