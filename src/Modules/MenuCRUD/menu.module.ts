import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DishEntity } from './dishes.entity';
import { DishesRepository } from './dishes.repository';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { StorageModule } from '../Adapters/ImageStorage/storage.module';
import { DishesQueryRepo } from './dishes.queryRepo';

@Module({
  imports: [TypeOrmModule.forFeature([DishEntity]), StorageModule],
  controllers: [MenuController],
  providers: [MenuService, DishesRepository, DishesQueryRepo],
  exports: [DishesRepository],
})
export class MenuModule {}
