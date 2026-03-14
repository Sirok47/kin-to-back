import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class ProfileInputModel {
  @ApiProperty({
    example: false,
    description: 'Сайт ВКЛ/ВЫКЛ',
  })
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  name?: string;

  @ApiProperty({
    example: 'example@gmail.com',
    description: 'Новый адрес почты',
  })
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({
    example: 'ул. Улица, д. 1',
    description: 'Новый адрес для доставки',
  })
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address?: string;
}

export class ProfileViewModel {
  @ApiProperty({
    example: 'Гавриил',
    description: 'Имя пользователя',
  })
  name: string;

  @ApiProperty({
    example: 'example@gmail.com',
    description: 'Адрес почты пользователя',
  })
  email: string;

  @ApiProperty({
    example: '+74232497777',
    description: 'Телефонный номер пользователя',
  })
  phoneNumber: string;

  @ApiProperty({
    example: 'ул. Улица, д. 1',
    description: 'Адрес доставки пользователя',
  })
  address: string;
}
