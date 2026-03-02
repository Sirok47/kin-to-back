import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { DishEntity } from './dishes.entity';
import {
  activeStateInput,
  dishId,
  DishInputModel,
  MenuViewModel,
} from './menu.dto';
import { DishesQueryRepo } from './dishes.queryRepo';
import { ApiBody, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Menu')
@Controller('menu')
export class MenuController {
  constructor(
    private readonly dishesQueryRepo: DishesQueryRepo,
    private readonly menuService: MenuService,
  ) {}

  @ApiResponse({
    status: 200,
    description: 'Возвращает объект с вложенным списком блюд',
    type: MenuViewModel,
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  async getMenu(): Promise<MenuViewModel> {
    return this.dishesQueryRepo.buildMenu(false);
  }

  @ApiBody({ type: DishInputModel })
  @ApiResponse({
    status: 201,
    description: 'Возвращает ID нового блюда',
    type: Number,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input',
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createDish(@Body() dish: DishInputModel): Promise<{ id: number }> {
    const createdDish: DishEntity = await this.menuService.addDishToMenu(dish);
    return { id: createdDish.id };
  }

  @ApiQuery({
    name: 'status',
    required: true,
    type: Boolean,
    description: 'Новый статус для блюда по ID',
  })
  @ApiResponse({
    status: 204,
    description: 'Статус изменен',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input',
  })
  @ApiResponse({
    status: 404,
    description: 'Dish does not exist',
  })
  @Put(':id/status')
  @HttpCode(HttpStatus.NO_CONTENT)
  async setStatus(
    @Param() { id }: dishId,
    @Query() { status }: activeStateInput,
  ): Promise<void> {
    await this.menuService.changeActiveState(id, status);
  }

  @ApiResponse({
    status: 204,
    description: 'Блюдо удалено',
  })
  @ApiResponse({
    status: 404,
    description: 'Dish does not exist',
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param() { id }: dishId): Promise<void> {
    await this.menuService.removeDishFromMenu(id);
  }
}
