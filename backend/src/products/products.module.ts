import { Module, forwardRef } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    PrismaModule, 
    CloudinaryModule, 
    forwardRef(() => NotificationsModule)
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
