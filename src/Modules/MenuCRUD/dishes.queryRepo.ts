import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DishEntity } from './dishes.entity';
import { Repository } from 'typeorm';
import { MenuViewModel } from './menu.dto';
import {
  IMAGE_STORAGE,
  type ImageStorage,
} from '../Adapters/ImageStorage/image-storage.interface';

@Injectable()
export class DishesQueryRepo {
  constructor(
    @Inject(IMAGE_STORAGE)
    private readonly imageStorage: ImageStorage,
    @InjectRepository(DishEntity) private readonly repo: Repository<DishEntity>,
  ) {}

  async buildMenu(showInactive: boolean): Promise<MenuViewModel> {
    const menu: MenuViewModel = {
      dishes: [],
    };
    let qb = this.repo.createQueryBuilder('d');
    if (!showInactive) {
      qb = qb.where('d."isActive" = true');
    }
    const result: DishEntity[] = await qb.getMany();
    for (const dish of result) {
      dish.imageLink = this.imageStorage.getLink(dish.imageLink);
      menu.dishes.push(dish.mapToViewModel());
    }

    return menu;
  }
}
