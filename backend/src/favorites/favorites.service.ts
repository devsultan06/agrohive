import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavoritesService {
  private readonly logger = new Logger(FavoritesService.name);

  constructor(private prisma: PrismaService) {}

  async toggle(userId: string, productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const favorite = await this.prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (favorite) {
      await this.prisma.favorite.delete({
        where: { id: favorite.id },
      });
      this.logger.log(`Product ${productId} unfavorited by user ${userId}`);
      return { isFavorite: false };
    } else {
      await this.prisma.favorite.create({
        data: {
          userId,
          productId,
        },
      });
      this.logger.log(`Product ${productId} favorited by user ${userId}`);
      return { isFavorite: true };
    }
  }

  async getMyFavorites(userId: string) {
    const favorites = await this.prisma.favorite.findMany({
      where: { userId },
      include: {
        product: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return favorites.map((f) => f.product);
  }

  async clearAll(userId: string) {
    await this.prisma.favorite.deleteMany({
      where: { userId },
    });
    this.logger.log(`All favorites cleared for user ${userId}`);
    return { message: 'All favorites cleared' };
  }
}
