import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Delete,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { GetCurrentUserId } from '../common/decorators/get-user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { Throttle, SkipThrottle } from '@nestjs/throttler';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { Query } from '@nestjs/common';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // Limit post creation to 10 per minute to prevent spam
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @GetCurrentUserId() userId: string,
    @Body() createPostDto: CreatePostDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.postsService.create(userId, createPostDto, image);
  }

  // Reading posts is frequent - skip throttling
  @SkipThrottle()
  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  async findAll(
    @Query('search') search?: string,
    @Query('hasImage') hasImage?: string,
    @Query('sortBy') sortBy?: string,
    @GetCurrentUserId() userId?: string,
  ) {
    return this.postsService.findAll(
      {
        search,
        hasImage: hasImage === 'true',
        sortBy,
      },
      userId,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Get('stats')
  async getCommunityStats() {
    return this.postsService.getCommunityStats();
  }

  @Get('top-contributors')
  async getTopContributors() {
    return this.postsService.getTopContributors();
  }

  @SkipThrottle()
  @Get('bookmarks')
  @UseGuards(JwtAuthGuard)
  async getBookmarks(@GetCurrentUserId() userId: string) {
    return this.postsService.getBookmarkedPosts(userId);
  }

  @SkipThrottle()
  @Get('user/:userId')
  async findByUser(
    @Param('userId') authorId: string,
    @GetCurrentUserId() currentUserId?: string,
  ) {
    return this.postsService.findByUser(authorId, currentUserId);
  }

  @SkipThrottle()
  @Get(':id')
  async findOne(@Param('id') id: string, @GetCurrentUserId() userId?: string) {
    return this.postsService.findOne(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  async toggleLike(
    @GetCurrentUserId() userId: string,
    @Param('id') id: string,
  ) {
    return this.postsService.toggleLike(userId, id);
  }

  // Limit comments to 15 per minute
  @Throttle({ default: { limit: 15, ttl: 60000 } })
  @UseGuards(JwtAuthGuard)
  @Post(':id/comment')
  async addComment(
    @GetCurrentUserId() userId: string,
    @Param('id') id: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.postsService.addComment(userId, id, createCommentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/bookmark')
  async toggleBookmark(
    @GetCurrentUserId() userId: string,
    @Param('id') id: string,
  ) {
    return this.postsService.toggleBookmark(userId, id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
}
