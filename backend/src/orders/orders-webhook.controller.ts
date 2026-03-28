import { Controller, Post, Body } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders-payment')
export class OrdersWebhookController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('webhook')
  handleWebhook(@Body() payload: any) {
    return this.ordersService.handlePaymentWebhook(payload);
  }
}
