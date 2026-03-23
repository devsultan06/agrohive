import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Query,
  Req,
} from '@nestjs/common';
import { GuidesService } from './guides.service';
import { CreateGuideDto, UpdateGuideDto } from './dto/guide.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('guides')
export class GuidesController {
  constructor(private readonly guidesService: GuidesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'video', maxCount: 1 },
      { name: 'thumbnail', maxCount: 1 },
    ]),
  )
  async create(
    @Body() createGuideDto: CreateGuideDto,
    @UploadedFiles()
    files: { video?: Express.Multer.File[]; thumbnail?: Express.Multer.File[] },
  ) {
    const video = files.video?.[0];
    const thumbnail = files.thumbnail?.[0];
    return this.guidesService.create(createGuideDto, video, thumbnail);
  }

  @Get()
  async findAll(@Query('search') search?: string) {
    return this.guidesService.findAll({ search });
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  async getStats() {
    return this.guidesService.getStats();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.guidesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'video', maxCount: 1 },
      { name: 'thumbnail', maxCount: 1 },
    ]),
  )
  async update(
    @Param('id') id: string,
    @Body() updateGuideDto: UpdateGuideDto,
    @UploadedFiles()
    files: { video?: Express.Multer.File[]; thumbnail?: Express.Multer.File[] },
  ) {
    const video = files.video?.[0];
    const thumbnail = files.thumbnail?.[0];
    return this.guidesService.update(id, updateGuideDto, video, thumbnail);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  async remove(@Param('id') id: string) {
    return this.guidesService.remove(id);
  }

  @Patch(':id/views')
  async incrementViews(@Param('id') id: string) {
    return this.guidesService.incrementViews(id);
  }
}
