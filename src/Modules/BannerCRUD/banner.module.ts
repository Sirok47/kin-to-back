import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageModule } from '../Adapters/ImageStorage/storage.module';
import { BannerController } from './banner.controller';
import { BannerEntity } from './banner.entity';
import { BannerService } from './banner.service';

@Module({
  imports: [TypeOrmModule.forFeature([BannerEntity]), StorageModule],
  controllers: [BannerController],
  providers: [BannerService],
  exports: [],
})
export class BannerModule {}
