import {
  Controller,
  Get,
  Patch,
  Post,
  Delete,
  Query,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetCurrentUserId } from '../common/decorators/get-user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { SkipThrottle } from '@nestjs/throttler';

// User profile actions are frequent — skip throttle
@SkipThrottle()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Administrative Endpoints
  @Get('admin/all')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MANAGER)
  async findAll(
    @Query('verified') verified?: string,
    @Query('search') search?: string,
  ) {
    return this.usersService.findAll({ verified, search });
  }

  @Patch('admin/:id/toggle-verify')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  async toggleVerification(@Param('id') id: string) {
    return this.usersService.toggleVerification(id);
  }

  @Get('admin/stats/recent-users')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MANAGER)
  async getRecentUsers(@Query('limit') limit?: string) {
    return this.usersService.getDashboardRecentUsers(Number(limit) || 4);
  }

  @Get('admin/stats/general')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.MANAGER)
  async getGeneralStats() {
    return this.usersService.getGeneralStats();
  }

  @Get('me')
  async getMe(@GetCurrentUserId() userId: string) {
    return this.usersService.getMe(userId);
  }

  @Patch('me')
  @UseInterceptors(FileInterceptor('image'))
  async updateMe(
    @GetCurrentUserId() userId: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.usersService.updateMe(userId, updateUserDto, image);
  }

  @Post('change-password')
  async changePassword(
    @GetCurrentUserId() userId: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(userId, changePasswordDto);
  }

  @Get(':id')
  async getUserById(
    @GetCurrentUserId() currentUserId: string,
    @Param('id') targetUserId: string,
  ) {
    return this.usersService.getUserById(targetUserId, currentUserId);
  }

  @Post(':id/follow')
  async toggleFollow(
    @GetCurrentUserId() followerId: string,
    @Param('id') followingId: string,
  ) {
    return this.usersService.toggleFollow(followerId, followingId);
  }

  @Delete('me')
  async deleteMe(@GetCurrentUserId() userId: string) {
    return this.usersService.deleteMe(userId);
  }
}
