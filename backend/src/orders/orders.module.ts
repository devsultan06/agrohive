import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { PaymentModule } from '../payment/payment.module';
import { OrdersWebhookController } from './orders-webhook.controller';

@Module({
  imports: [PrismaModule, NotificationsModule, PaymentModule],
  providers: [OrdersService],
  controllers: [OrdersController, OrdersWebhookController],
})
export class OrdersModule {}
