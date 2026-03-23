import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetCurrentUserId } from '../common/decorators/get-user.decorator';
import { SkipThrottle } from '@nestjs/throttler';

// Notifications are polled frequently — skip throttle
@SkipThrottle()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

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
