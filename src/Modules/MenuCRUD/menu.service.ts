import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DishesRepository } from './dishes.repository';
import { DishEntity } from './dishes.entity';
import { DishInputModel } from './menu.dto';
import {
  IMAGE_STORAGE,
  type ImageStorage,
} from '../Adapters/ImageStorage/image-storage.interface';

@Injectable()
export class MenuService {
  constructor(
    @Inject(IMAGE_STORAGE)
    private readonly imageStorage: ImageStorage,
    private readonly repository: DishesRepository,
  ) {}

  async addDishToMenu(dish: DishInputModel): Promise<DishEntity> {
    const base64 = dish.image.split(',')[1];
    const buffer = Buffer.from(base64, 'base64');
    const fileName = `${Date.now()}.png`;

    const link: string = await this.imageStorage.upload(fileName, buffer);
    return this.repository.save(DishEntity.createEntry(dish, link));
  }

  async removeDishFromMenu(id: number): Promise<boolean> {
    const dish: DishEntity | null = await this.repository.findById(id);
    if (!dish) {
      throw new NotFoundException('Dish does not exist');
    }
    await this.imageStorage.delete(dish.imageLink);
    return this.repository.delete(id);
  }

  async changeActiveState(id: number, status: boolean): Promise<boolean> {
    const dish: DishEntity | null = await this.repository.findById(id);
    if (!dish) {
      throw new NotFoundException('Dish does not exist');
    }
    dish.setActiveState(status);
    return !!(await this.repository.save(dish));
  }
}
