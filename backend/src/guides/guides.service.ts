import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGuideDto, UpdateGuideDto } from './dto/guide.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class GuidesService {
  private readonly logger = new Logger(GuidesService.name);

  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService,
    private notifications: NotificationsService,
  ) {}

  async create(
    dto: CreateGuideDto,
    video?: Express.Multer.File,
    thumbnail?: Express.Multer.File,
  ) {
    this.logger.log(`Creating farming guide: ${dto.title}`);

    let videoUrl = null;
    let thumbnailUrl = null;

    if (video) {
      const upload = await this.cloudinary.uploadFile(
        video,
        'agrohive_guides',
        'video',
      );
      videoUrl = upload.secure_url;
      this.logger.log(`Guide video uploaded to Cloudinary`);
    }

    if (thumbnail) {
      const upload = await this.cloudinary.uploadFile(
        thumbnail,
        'agrohive_guides',
        'image',
      );
      thumbnailUrl = upload.secure_url;
      this.logger.log(`Guide thumbnail uploaded to Cloudinary`);
    }

    const guide = await this.prisma.farmingGuide.create({
      data: {
        ...dto,
        videoUrl,
        thumbnailUrl,
      },
    });

    // Notify all users about new guide
    await this.notifications.notifyAll({
      type: 'SYSTEM',
      title: 'New Farming Guide!',
      message: `Learn something new: "${guide.title}" is now available in the library.`,
      metadata: { screen: 'GuideDetails', params: { guideId: guide.id } },
    });

    this.logger.log(`Guide created and notifications sent: ${guide.id}`);
    return guide;
  }

  async findAll(query?: { search?: string }) {
    const { search } = query || {};
    return this.prisma.farmingGuide.findMany({
      where: {
        isActive: true,
        ...(search
          ? {
              OR: [
                { title: { contains: search, mode: 'insensitive' } },
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
    return this.prisma.farmingGuide.findUnique({
      where: { id },
    });
  }

  async update(
    id: string,
    dto: UpdateGuideDto,
    video?: Express.Multer.File,
    thumbnail?: Express.Multer.File,
  ) {
    this.logger.log(`Updating farming guide: ${id}`);

    const updateData: any = { ...dto };

    if (video) {
      const upload = await this.cloudinary.uploadFile(
        video,
        'agrohive_guides',
        'video',
      );
      updateData.videoUrl = upload.secure_url;
    }

    if (thumbnail) {
      const upload = await this.cloudinary.uploadFile(
        thumbnail,
        'agrohive_guides',
        'image',
      );
      updateData.thumbnailUrl = upload.secure_url;
    }

    return this.prisma.farmingGuide.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string) {
    return this.prisma.farmingGuide.delete({
      where: { id },
    });
  }

  async incrementViews(id: string) {
    return this.prisma.farmingGuide.update({
      where: { id },
      data: { views: { increment: 1 } },
    });
  }

  // Stats for Admin
  async getStats() {
    const [_count, _sum] = await Promise.all([
      this.prisma.farmingGuide.count(),
      this.prisma.farmingGuide.aggregate({
        _sum: { views: true },
      }),
    ]);

    return {
      totalVideos: _count,
      totalViews: _sum._sum.views || 0,
      published: _count, // Placeholder for status filtering
    };
  }
}
