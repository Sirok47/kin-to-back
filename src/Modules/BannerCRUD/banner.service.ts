import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  IMAGE_STORAGE,
  type ImageStorage,
} from '../Adapters/ImageStorage/image-storage.interface';
import { BannerEntity } from './banner.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BannerService {
  constructor(
    @Inject(IMAGE_STORAGE)
    private readonly imageStorage: ImageStorage,
    @InjectRepository(BannerEntity)
    private readonly repo: Repository<BannerEntity>,
  ) {}

  async getAllBannerLinks(): Promise<string[]> {
    const arr = await this.repo.findBy({});
    return arr.map((entity: BannerEntity) => entity.imageLink);
  }

  async addBanner(banner: string): Promise<BannerEntity> {
    const base64 = banner.split(',')[1];
    const buffer = Buffer.from(base64, 'base64');
    const fileName = `${Date.now()}.png`;

    const link: string = await this.imageStorage.upload(fileName, buffer);
    return this.repo.save(BannerEntity.createEntity(link));
  }

  async removeBanner(id: number): Promise<boolean> {
    const banner: BannerEntity | null = await this.repo.findOneBy({ id: id });
    if (!banner) {
      throw new NotFoundException('Banner does not exist');
    }
    await this.imageStorage.delete(banner.imageLink);
    return !!(await this.repo.delete(id)).affected;
  }
}
