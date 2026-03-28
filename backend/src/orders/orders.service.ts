import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  async create(
    userId: string,
    items: { productId: string; quantity: number }[],
    shippingAddress?: string,
    shippingPhone?: string,
  ) {
    this.logger.log(`Creating order for user: ${userId}`);

    if (!items || items.length === 0) {
      throw new BadRequestException('Order must have at least one item');
    }

    // Calc total and verify products
    let totalAmount = 0;
    const orderItemsData: {
      productId: string;
      quantity: number;
      price: number;
    }[] = [];

    for (const item of items) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
      });
      if (!product) {
        throw new NotFoundException(`Product ${item.productId} not found`);
      }
      if (product.stock < item.quantity) {
        throw new BadRequestException(`Insufficient stock for ${product.name}`);
      }
      totalAmount += product.price * item.quantity;
      orderItemsData.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      });

      // Update stock
      await this.prisma.product.update({
        where: { id: item.productId },
        data: { stock: product.stock - item.quantity },
      });
    }

    const orderNumber = `ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const order = await this.prisma.order.create({
      data: {
        orderNumber,
        userId,
        totalAmount,
        status: OrderStatus.PLACED,
        shippingAddress,
        shippingPhone,
        items: {
          create: orderItemsData,
        },
        statusHistory: {
          create: {
            status: OrderStatus.PLACED,
            userId,
          },
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Notify user
    await this.notifications.create(userId, {
      type: 'ORDER_UPDATE',
      title: 'Order Placed! 📦',
      message: `Your order ${orderNumber} has been successfully placed.`,
      metadata: {
        orderId: order.id,
        status: order.status,
        screen: 'OrderDetails',
      },
    });

    return order;
  }

  async findAll(query?: { status?: OrderStatus; search?: string }) {
    return this.prisma.order.findMany({
      where: {
        ...(query?.status ? { status: query.status } : {}),
        ...(query?.search
          ? { orderNumber: { contains: query.search, mode: 'insensitive' } }
          : {}),
      },
      include: {
        user: { select: { id: true, fullName: true, email: true } },
        _count: { select: { items: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findUserOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: { include: { product: true } },
        statusHistory: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        user: true,
        items: { include: { product: true } },
        statusHistory: { orderBy: { createdAt: 'asc' } },
      },
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateStatus(id: string, status: OrderStatus) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { user: true },
    });
    if (!order) throw new NotFoundException('Order not found');

    const updatedOrder = await this.prisma.order.update({
      where: { id },
      data: {
        status,
        statusHistory: {
          create: {
            status,
            userId: order.userId,
          },
        },
      },
      include: { statusHistory: true },
    });

    // Notify user of status change
    let title = 'Order Update 🚛';
    let message = `Your order ${order.orderNumber} status changed to ${status.toLowerCase()}.`;

    if (status === OrderStatus.PROCESSING) {
      title = 'Order Processing ⚙️';
      message = `Your order ${order.orderNumber} is now being processed.`;
    } else if (status === OrderStatus.SHIPPED) {
      title = 'Order Shipped! 🚚';
      message = `Great news! Your order ${order.orderNumber} is on its way.`;
    } else if (status === OrderStatus.DELIVERED) {
      title = 'Order Delivered! ✅';
      message = `Your order ${order.orderNumber} has been delivered. Thank you for shopping!`;
    }

    await this.notifications.create(order.userId, {
      type: 'ORDER_UPDATE',
      title,
      message,
      metadata: {
        orderId: order.id,
        status: updatedOrder.status,
        screen: 'OrderDetails',
      },
    });

    this.logger.log(`Order ${id} status updated to ${status}`);
    return updatedOrder;
  }
}
