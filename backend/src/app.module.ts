import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { redisStore } from 'cache-manager-redis-yet';
import configuration from './common/config/configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import  { MailModule } from './mail/mail.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { ReviewsModule } from './reviews/reviews.module';
import { FavoritesModule } from './favorites/favorites.module';
import { NotificationsModule } from './notifications/notifications.module';
import { FirebaseModule } from './firebase/firebase.module';
import { PostsModule } from './posts/posts.module';
import { GuidesModule } from './guides/guides.module';
import { OrdersModule } from './orders/orders.module';
import { AddressesModule } from './addresses/addresses.module';
import { PaymentModule } from './payment/payment.module';
import { ChatModule } from './chat/chat.module';
import { TelegramModule } from './telegram/telegram.module';
import { AppThrottlerGuard } from './common/guards/app-throttler.guard';

@Module({
  imports: [
    TelegramModule,

    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    // Rate limiting — default: 60 requests per 60 seconds per IP
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60000,
        limit: 60,
      },
    ]),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async (configService: ConfigService) => {
        const url = configService.get('redis.url') || 
                   `redis://${configService.get('redis.host')}:${configService.get('redis.port')}`;
        
        return {
          store: await redisStore({
            url,
            // Explicit TLS and Reconnect settings
            socket: {
              tls: url.startsWith('rediss'),
              reconnectStrategy: (retries) => {
                const delay = Math.min(retries * 50, 2000);
                return delay;
              },
              connectTimeout: 10000,
            },
            ttl: 600000, // 10 minutes default
          }),
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    PrismaModule,
    MailModule,
    CloudinaryModule,
    UsersModule,
    ProductsModule,
    ReviewsModule,
    FavoritesModule,
    NotificationsModule,
    FirebaseModule,
    PostsModule,
    GuidesModule,
    OrdersModule,
    AddressesModule,
    PaymentModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Apply throttle guard globally to all routes
    {
      provide: APP_GUARD,
      useClass: AppThrottlerGuard,
    },
  ],
})
export class AppModule {}
