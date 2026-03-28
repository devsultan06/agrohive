import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';
import { PaymentService } from '../payment/payment.service';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
    private readonly paymentService: PaymentService,
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

      // We only update stock AFTER successful payment in a real system,
      // but for simplicity we can do it here or handle it in the webhook.
      // Let's keep it simple for now and update it during order creation.
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
    const order = await this.findOne(id);

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

  async initiatePayment(orderId: string, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId, userId },
      include: { user: true },
    });

    if (!order) throw new NotFoundException('Order not found');
    if (order.paymentStatus === 'SUCCESS') {
      throw new BadRequestException('Order already paid');
    }

    const reference = `PAY-${order.orderNumber}-${Date.now()}`;

    const metadata = {
      orderNumber: order.orderNumber,
      orderId: order.id,
      shipping: {
        address: order.shippingAddress,
        phone: order.shippingPhone,
      },
      custom_fields: [
        {
          display_name: 'Shipping Address',
          variable_name: 'shipping_address',
          value: order.shippingAddress || 'N/A',
        },
        {
          display_name: 'Phone Number',
          variable_name: 'phone_number',
          value: order.shippingPhone || 'N/A',
        },
      ],
    };

    const paymentData = await this.paymentService.initializeTransaction(
      order.user.email,
      order.totalAmount,
      reference,
      metadata,
    );

    await this.prisma.order.update({
      where: { id: orderId },
      data: { paymentReference: reference },
    });

    return paymentData; // returns authorization_url
  }

  async findAllAdmin() {
    this.logger.log('Fetching all orders for admin');
    return this.prisma.order.findMany({
      include: {
        user: { select: { fullName: true, email: true, avatarUrl: true } },
        items: {
          include: { product: { select: { name: true, imageUrl: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async handlePaymentWebhook(payload: any) {
    const { reference } = payload.data;

    if (payload.event === 'charge.success') {
      const order = await this.prisma.order.findUnique({
        where: { paymentReference: reference },
      });

      if (order && order.paymentStatus !== 'SUCCESS') {
        await this.prisma.order.update({
          where: { id: order.id },
          data: {
            paymentStatus: 'SUCCESS',
            status: OrderStatus.PROCESSING,
            statusHistory: {
              create: {
                status: OrderStatus.PROCESSING,
                userId: order.userId,
              },
            },
          },
        });

        // Notify user
        await this.notifications.create(order.userId, {
          type: 'ORDER_UPDATE',
          title: 'Payment Confirmed! ✅',
          message: `We've received payment for order ${order.orderNumber}. Processing now.`,
          metadata: { orderId: order.id, status: 'PROCESSING' },
        });
      }
    }

    return { status: 'success' };
  }
}
