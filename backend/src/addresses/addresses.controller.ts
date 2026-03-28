import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetCurrentUserId } from '../common/decorators/get-user.decorator';

@Controller('addresses')
@UseGuards(JwtAuthGuard)
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post()
  create(@GetCurrentUserId() userId: string, @Body() data: any) {
    return this.addressesService.create(userId, data);
  }

  @Get()
  findAll(@GetCurrentUserId() userId: string) {
    return this.addressesService.findAll(userId);
  }

  @Get(':id')
  findOne(@GetCurrentUserId() userId: string, @Param('id') id: string) {
    return this.addressesService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @GetCurrentUserId() userId: string,
    @Param('id') id: string,
    @Body() data: any,
  ) {
    return this.addressesService.update(id, userId, data);
  }

  @Delete(':id')
  remove(@GetCurrentUserId() userId: string, @Param('id') id: string) {
    return this.addressesService.remove(id, userId);
  }

  @Patch(':id/default')
  setDefault(@GetCurrentUserId() userId: string, @Param('id') id: string) {
    return this.addressesService.setDefault(id, userId);
  }
}
