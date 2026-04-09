import { Module, forwardRef } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { PaymentModule } from '../payment/payment.module';
import { OrdersWebhookController } from './orders-webhook.controller';

@Module({
  imports: [
    PrismaModule, 
    forwardRef(() => NotificationsModule), 
    PaymentModule
  ],
  providers: [OrdersService],
  controllers: [OrdersController, OrdersWebhookController],
  exports: [OrdersService],
})
export class OrdersModule {}
