import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AddressesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, data: any) {
    // If setting as default, unset other defaults
    if (data.isDefault) {
      await this.prisma.userAddress.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    // Capture the phone number correctly from the data
    return this.prisma.userAddress.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.userAddress.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const address = await this.prisma.userAddress.findFirst({
      where: { id, userId },
    });
    if (!address) throw new NotFoundException('Address not found');
    return address;
  }

  async update(id: string, userId: string, data: any) {
    await this.findOne(id, userId);

    if (data.isDefault) {
      await this.prisma.userAddress.updateMany({
        where: { userId, isDefault: true, id: { not: id } },
        data: { isDefault: false },
      });
    }

    return this.prisma.userAddress.update({
      where: { id },
      data,
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.userAddress.delete({
      where: { id },
    });
  }

  async setDefault(id: string, userId: string) {
    await this.findOne(id, userId);

    await this.prisma.userAddress.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });

    return this.prisma.userAddress.update({
      where: { id },
      data: { isDefault: true },
    });
  }
}
