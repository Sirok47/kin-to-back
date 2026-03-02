import { IsBoolean, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

export class DishInputModel {
  @ApiProperty({
    example: 'Даджин-Куги с картофелем под сырным соусом',
    description: 'Название блюда',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Нежное куриное филе, подается с картофелем под сырным соусом.',
    description: 'Описание блюда',
  })
  @IsString()
  description: string;

  @ApiProperty({ example: 625, description: 'Цена блюда' })
  @IsNumber()
  price: number;

  @ApiProperty({
    example: 'data:image/jpeg;base64,...',
    description: 'Изображение блюда в base64!',
  })
  @IsString()
  image: string;

  @ApiProperty({ example: 'hotDishes', description: 'Категория блюда' })
  @IsString()
  category: string; //enum?

  @ApiProperty({ example: true, description: 'Указывает острое ли блюдо' })
  @IsBoolean()
  isSpicy: boolean;
}

export class DishViewModel {
  @ApiProperty({
    example: '35',
    description: 'ID для обозначения блюда между клиентом и сервером',
  })
  id: number;
  @ApiProperty({
    example: 'Даджин-Куги с картофелем под сырным соусом',
    description: 'Название блюда',
  })
  name: string;
  @ApiProperty({
    example: 'Нежное куриное филе, подается с картофелем под сырным соусом.',
    description: 'Описание блюда',
  })
  description: string;
  @ApiProperty({ example: 625, description: 'Цена блюда' })
  price: number;
  @ApiProperty({
    example:
      'https://msbgqrxjlaikpywovuvj.storage.supabase.co/storage/v1/object/public/Kin-to_stash/1764265127824.png',
    description: 'Ссылка на облако с изображением блюда',
  })
  imageLink: string;
  @ApiProperty({ example: 'hotDishes', description: 'Категория блюда' })
  category: string;
  @ApiProperty({ example: true, description: 'Указывает острое ли блюдо' })
  isSpicy: boolean;
  @ApiProperty({
    example: true,
    description: 'Указывает доступно ли к заказу блюдо',
  })
  isActive: boolean;
}

export class MenuViewModel {
  @ApiProperty({ type: [DishViewModel] })
  dishes: DishViewModel[];
}

export class dishId {
  @Type(() => Number)
  @IsNumber()
  id: number;
}

export class activeStateInput {
  @Transform(({ value }) => value === 'true' || value === '1')
  @IsBoolean()
  status: boolean;
}
