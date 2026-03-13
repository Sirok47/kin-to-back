import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AdminAuthGuard } from '../../Middlewares/Guards/admin.guard';
import { bannerId, BannerInputModel, BannerViewModel } from './banner.dto';
import { BannerService } from './banner.service';
import { BannerEntity } from './banner.entity';

@ApiTags('Banners')
@UseGuards(AdminAuthGuard)
@Controller('banner')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @ApiResponse({
    status: 200,
    description: 'Возвращает объект с вложенным списком ссылок на баннеры',
    type: BannerViewModel,
  })
  @UseGuards()
  @Get()
  @HttpCode(HttpStatus.OK)
  async getAll(): Promise<BannerViewModel> {
    return { bannerLinks: await this.bannerService.getAllBannerLinks() };
  }

  @ApiBody({ type: BannerInputModel })
  @ApiResponse({
    status: 201,
    description: 'Возвращает ID нового баннера',
    type: Number,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input',
  })
  @ApiBearerAuth()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createBanner(
    @Body() { banner }: BannerInputModel,
  ): Promise<{ id: number }> {
    const createdBanner: BannerEntity =
      await this.bannerService.addBanner(banner);
    return { id: createdBanner.id };
  }

  @ApiResponse({
    status: 204,
    description: 'Баннер удален',
  })
  @ApiResponse({
    status: 404,
    description: 'Banner does not exist',
  })
  @ApiBearerAuth()
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param() { id }: bannerId): Promise<void> {
    await this.bannerService.removeBanner(id);
  }
}
