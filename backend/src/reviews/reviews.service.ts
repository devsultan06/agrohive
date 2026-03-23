import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  private readonly logger = new Logger(ReviewsService.name);

  constructor(private prisma: PrismaService) {}

  async create(userId: string, createReviewDto: CreateReviewDto) {
    const { productId, rating, comment } = createReviewDto;

    // Verify product exists
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const review = await this.prisma.review.create({
      data: {
        userId,
        productId,
        rating,
        comment,
      },
      include: {
        user: {
          select: {
            fullName: true,
            avatarUrl: true,
          },
        },
      },
    });

    // Update product average rating
    const reviews = await this.prisma.review.findMany({
      where: { productId },
    });

    const averageRating =
      reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length;

    await this.prisma.product.update({
      where: { id: productId },
      data: { rating: averageRating },
    });

    this.logger.log(
      `Review created for product ${productId} by user ${userId} — rating: ${rating}, new avg: ${averageRating.toFixed(1)}`,
    );

    return review;
  }

  async findByProduct(productId: string) {
    return this.prisma.review.findMany({
      where: { productId },
      include: {
        user: {
          select: {
            fullName: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getAdminStats() {
    this.logger.log('Calculating admin review stats');
    const [totalReviews, totalFavorites, productsCount, reviewsByProduct] =
      await Promise.all([
        this.prisma.review.count(),
        this.prisma.favorite.count(),
        this.prisma.product.count(),
        this.prisma.review.groupBy({
          by: ['productId'],
          _count: true,
          _avg: { rating: true },
        }),
      ]);

    const productsReviewed = reviewsByProduct.length;
    const avgRating =
      reviewsByProduct.reduce((acc, curr) => acc + (curr._avg.rating || 0), 0) /
      (productsReviewed || 1);

    return {
      totalReviews,
      totalFavorites,
      productsReviewed,
      totalProducts: productsCount,
      avgRating: Number(avgRating.toFixed(1)),
    };
  }

  async findAll(query?: { search?: string }) {
    const { search } = query || {};
    this.logger.log(`Admin feting all reviews — search: ${search || 'none'}`);

    return this.prisma.review.findMany({
      where: search
        ? {
            OR: [
              { comment: { contains: search, mode: 'insensitive' } },
              { user: { fullName: { contains: search, mode: 'insensitive' } } },
              {
                product: { name: { contains: search, mode: 'insensitive' } },
              },
            ],
          }
        : {},
      include: {
        user: { select: { fullName: true, avatarUrl: true } },
        product: { select: { name: true, imageUrl: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getMostFavorited(limit = 4) {
    this.logger.log(`Admin fetching top ${limit} favorited products`);
    const topFavorites = await this.prisma.favorite.groupBy({
      by: ['productId'],
      _count: true,
      orderBy: { _count: { productId: 'desc' } },
      take: limit,
    });

    const products = await Promise.all(
      topFavorites.map(async (fav) => {
        const product = await this.prisma.product.findUnique({
          where: { id: fav.productId },
          select: { name: true, imageUrl: true },
        });
        return {
          id: fav.productId,
          ...product,
          favoritesCount: fav._count,
        };
      }),
    );

    return products;
  }
}
