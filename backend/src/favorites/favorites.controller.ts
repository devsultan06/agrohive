import { Controller, Post, Body, UseGuards, Get, Delete } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { ToggleFavoriteDto } from './dto/toggle-favorite.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetCurrentUserId } from '../common/decorators/get-user.decorator';
import { SkipThrottle } from '@nestjs/throttler';

// Favorites are toggled while browsing — skip throttle
@SkipThrottle()
@UseGuards(JwtAuthGuard)
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post('toggle')
  toggle(@GetCurrentUserId() userId: string, @Body() dto: ToggleFavoriteDto) {
    return this.favoritesService.toggle(userId, dto.productId);
  }

  @Get()
  getMyFavorites(@GetCurrentUserId() userId: string) {
    return this.favoritesService.getMyFavorites(userId);
  }

  @Delete('clear')
  clearAll(@GetCurrentUserId() userId: string) {
    return this.favoritesService.clearAll(userId);
  }
}
