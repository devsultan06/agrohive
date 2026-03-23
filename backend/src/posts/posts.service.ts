import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateCommentDto } from './dto/create-comment.dto';

import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);

  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
    private notifications: NotificationsService,
  ) {}

  async create(
    userId: string,
    createPostDto: CreatePostDto,
    image?: Express.Multer.File,
  ) {
    let imageUrl = createPostDto.imageUrl;

    if (image) {
      const upload = await this.cloudinary.uploadFile(image);
      imageUrl = upload.secure_url;
    }

    const post = await this.prisma.post.create({
      data: {
        content: createPostDto.content,
        imageUrl,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            username: true,
            avatarUrl: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    this.logger.log(`Post created by user ${userId}: ${post.id}`);
    return post;
  }

  async findAll(
    query?: { search?: string; hasImage?: boolean; sortBy?: string },
    userId?: string,
  ) {
    const { search, hasImage, sortBy } = query || {};

    const posts = await this.prisma.post.findMany({
      where: {
        ...(search
          ? { content: { contains: search, mode: 'insensitive' } }
          : {}),
        ...(hasImage ? { imageUrl: { not: null } } : {}),
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            username: true,
            avatarUrl: true,
            followers: userId ? { where: { followerId: userId } } : false,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                username: true,
                avatarUrl: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
            bookmarks: true,
          },
        },
        likes: userId ? { where: { userId } } : false,
        bookmarks: userId ? { where: { userId } } : false,
      },
      orderBy:
        sortBy === 'likes'
          ? { likes: { _count: 'desc' } }
          : { createdAt: 'desc' },
    });

    return posts.map((post) => ({
      ...post,
      isLiked: post.likes ? post.likes.length > 0 : false,
      isBookmarked: post.bookmarks ? post.bookmarks.length > 0 : false,
      isFollowing: (post.user as any).followers?.length > 0,
      likesCount: post._count.likes,
      commentsCount: post._count.comments,
      bookmarksCount: post._count.bookmarks,
    }));
  }

  async findByUser(authorId: string, currentUserId?: string) {
    const posts = await this.prisma.post.findMany({
      where: { userId: authorId },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            username: true,
            avatarUrl: true,
            followers: currentUserId
              ? { where: { followerId: currentUserId } }
              : false,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
            bookmarks: true,
          },
        },
        likes: currentUserId ? { where: { userId: currentUserId } } : false,
        bookmarks: currentUserId ? { where: { userId: currentUserId } } : false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return posts.map((post) => ({
      ...post,
      isLiked: post.likes ? post.likes.length > 0 : false,
      isBookmarked: post.bookmarks ? post.bookmarks.length > 0 : false,
      isFollowing: (post.user as any).followers?.length > 0,
      likesCount: post._count.likes,
      commentsCount: post._count.comments,
      bookmarksCount: post._count.bookmarks,
    }));
  }

  async findOne(id: string, userId?: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            username: true,
            avatarUrl: true,
            followers: userId ? { where: { followerId: userId } } : false,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                username: true,
                avatarUrl: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
            bookmarks: true,
          },
        },
        likes: userId ? { where: { userId } } : false,
        bookmarks: userId ? { where: { userId } } : false,
      },
    });

    if (!post) throw new NotFoundException('Post not found');

    return {
      ...post,
      isLiked: post.likes ? post.likes.length > 0 : false,
      isBookmarked: post.bookmarks ? post.bookmarks.length > 0 : false,
      isFollowing: (post.user as any).followers?.length > 0,
      likesCount: post._count.likes,
      commentsCount: post._count.comments,
      bookmarksCount: post._count.bookmarks,
    };
  }

  async toggleLike(userId: string, postId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      select: { userId: true },
    });

    if (!post) throw new NotFoundException('Post not found');

    const existingLike = await this.prisma.like.findUnique({
      where: {
        userId_postId: { userId, postId },
      },
    });

    if (existingLike) {
      await this.prisma.like.delete({
        where: { id: existingLike.id },
      });
      this.logger.log(`Post ${postId} unliked by user ${userId}`);
      return { liked: false };
    } else {
      await this.prisma.like.create({
        data: { userId, postId },
      });

      // Create notification for post owner if it's not the same user
      if (post.userId !== userId) {
        const user = await this.prisma.user.findUnique({
          where: { id: userId },
          select: { fullName: true },
        });

        await this.notifications.create(post.userId, {
          type: 'LIKE',
          title: 'New Like! ❤️',
          message: `${user?.fullName || 'Someone'} liked your post.`,
          metadata: { params: { post: { id: postId } }, screen: 'PostDetails' },
        });
      }

      this.logger.log(`Post ${postId} liked by user ${userId}`);
      return { liked: true };
    }
  }

  async addComment(
    userId: string,
    postId: string,
    createCommentDto: CreateCommentDto,
  ) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      select: { userId: true },
    });

    if (!post) throw new NotFoundException('Post not found');

    const comment = await this.prisma.comment.create({
      data: {
        content: createCommentDto.content,
        userId,
        postId,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
    });

    // Create notification for post owner if it's not the same user
    if (post.userId !== userId) {
      await this.notifications.create(post.userId, {
        type: 'COMMENT',
        title: 'New Comment! 💬',
        message: `${comment.user.fullName} commented on your post: "${comment.content.substring(0, 30)}${comment.content.length > 30 ? '...' : ''}"`,
        metadata: { params: { post: { id: postId } }, screen: 'PostDetails' },
      });
    }

    this.logger.log(`Comment added to post ${postId} by user ${userId}`);
    return comment;
  }

  async toggleBookmark(userId: string, postId: string) {
    const existingBookmark = await this.prisma.bookmark.findUnique({
      where: {
        userId_postId: { userId, postId },
      },
    });

    if (existingBookmark) {
      await this.prisma.bookmark.delete({
        where: { id: existingBookmark.id },
      });
      this.logger.log(`Post ${postId} unbookmarked by user ${userId}`);
      return { bookmarked: false };
    } else {
      await this.prisma.bookmark.create({
        data: { userId, postId },
      });
      this.logger.log(`Post ${postId} bookmarked by user ${userId}`);
      return { bookmarked: true };
    }
  }

  async getBookmarkedPosts(userId: string) {
    const bookmarks = await this.prisma.bookmark.findMany({
      where: { userId },
      include: {
        post: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                username: true,
                avatarUrl: true,
              },
            },
            _count: {
              select: {
                likes: true,
                comments: true,
                bookmarks: true,
              },
            },
            likes: { where: { userId } },
            bookmarks: { where: { userId } },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return bookmarks.map((b) => ({
      ...b.post,
      isLiked: b.post.likes.length > 0,
      isBookmarked: true,
      likesCount: b.post._count.likes,
      commentsCount: b.post._count.comments,
      bookmarksCount: b.post._count.bookmarks,
    }));
  }

  async remove(id: string) {
    return this.prisma.post.delete({
      where: { id },
    });
  }

  // Stats for Admin Dashboard
  async getCommunityStats() {
    const [totalPosts, totalLikes, totalComments, totalBookmarks] =
      await Promise.all([
        this.prisma.post.count(),
        this.prisma.like.count(),
        this.prisma.comment.count(),
        this.prisma.bookmark.count(),
      ]);

    return {
      totalPosts,
      totalLikes,
      totalComments,
      totalBookmarks,
    };
  }

  async getTopContributors() {
    const topUsers = await this.prisma.user.findMany({
      take: 5,
      where: {
        posts: { some: {} },
      },
      select: {
        id: true,
        fullName: true,
        username: true,
        avatarUrl: true,
        _count: {
          select: { posts: true },
        },
      },
      orderBy: {
        posts: { _count: 'desc' },
      },
    });

    return topUsers.map((user) => ({
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      avatarUrl: user.avatarUrl,
      postsCount: user._count.posts,
    }));
  }
}
