import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    image?: Express.Multer.File,
  ) {
    this.logger.log(`Updating product: ${id}`);

    let imageUrl = undefined;

    if (image) {
      const upload = await this.cloudinary.uploadFile(image);
      imageUrl = upload.secure_url;
      this.logger.log(`New product image uploaded to Cloudinary`);
    }

    const { price, rating, stock, ...rest } = updateProductDto;

    const updateData: any = {
      ...updateProductDto,
    };

    if (price !== undefined) updateData.price = Number(price);
    if (rating !== undefined) updateData.rating = Number(rating);
    if (stock !== undefined) updateData.stock = Number(stock);
    if (imageUrl) updateData.imageUrl = imageUrl;

    const product = await this.prisma.product.update({
      where: { id },
      data: updateData,
    });

    this.logger.log(`Product updated: ${product.id}`);
    return product;
  }

  async remove(id: string) {
    this.logger.log(`Deleting product: ${id}`);
    return this.prisma.product.delete({
      where: { id },
    });
  }

  async create(
    createProductDto: CreateProductDto,
    image?: Express.Multer.File,
  ) {
    this.logger.log(`Creating product: ${createProductDto.name}`);

    let imageUrl = null;

    if (image) {
      const upload = await this.cloudinary.uploadFile(image);
      imageUrl = upload.secure_url;
      this.logger.log(`Product image uploaded to Cloudinary`);
    }

    const product = await this.prisma.product.create({
      data: {
        ...createProductDto,
        price: Number(createProductDto.price),
        rating: createProductDto.rating ? Number(createProductDto.rating) : 0,
        stock: createProductDto.stock ? Number(createProductDto.stock) : 0,
        isActive: createProductDto.isActive ?? true,
        imageUrl,
      },
    });

    this.logger.log(
      `Product created: ${product.id} — ${product.name} (₦${product.price})`,
    );
    return product;
  }

  async findAll(query?: {
    category?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }) {
    const { category, search, limit = 10, offset = 0 } = query || {};
    this.logger.log(
      `Fetching products — category: ${category || 'all'}, search: ${search || 'none'}`,
    );

    return this.prisma.product.findMany({
      take: Number(limit),
      skip: Number(offset),
      where: {
        ...(category && category !== 'All products' ? { category } : {}),
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  async getProductsByCategory() {
    this.logger.log('Fetching product category stats');
    const categories = await this.prisma.product.groupBy({
      by: ['category'],
      _count: true,
    });

    const total = categories.reduce((acc, curr) => acc + curr._count, 0);

    return categories.map((cat) => ({
      name: cat.category,
      count: cat._count,
      percentage:
        total > 0 ? Number(((cat._count / total) * 100).toFixed(1)) : 0,
    }));
  }

  async getInventoryStats() {
    this.logger.log('Calculating live inventory highlights');
    const products = await this.prisma.product.findMany({
      select: {
        id: true,
        name: true,
        stock: true,
        orderItems: {
          where: {
            order: {
              paymentStatus: 'SUCCESS',
            },
          },
          select: {
            quantity: true,
          },
        },
      },
      take: 6,
      orderBy: {
        stock: 'desc',
      },
    });

    return products.map((p) => ({
      name: p.name,
      stock: p.stock,
      sold: p.orderItems.reduce((acc, item) => acc + item.quantity, 0),
    }));
  }
}
