import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DishEntity } from './dishes.entity';

@Injectable()
export class DishesRepository {
  constructor(
    @InjectRepository(DishEntity) private readonly repo: Repository<DishEntity>,
  ) {}

  async save(dish: DishEntity): Promise<DishEntity> {
    return this.repo.save(dish);
  }

  async findById(id: number): Promise<DishEntity | null> {
    return this.repo.findOneBy({ id: id });
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete(id);
    return !!result.affected;
  }

  async deleteAll(): Promise<void> {
    await this.repo.deleteAll();
  }
}
