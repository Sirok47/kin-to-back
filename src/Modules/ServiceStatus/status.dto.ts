import { IsBoolean, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ServiceStatusViewModel {
  @ApiProperty({ type: Boolean })
  isActive: boolean;

  @ApiProperty({ type: Number })
  approxReadyTime: number;

  @ApiProperty({ type: Number })
  approxDeliveryTime: number;
}

export class ServiceStatusDTO {
  @ApiProperty({
    example: false,
    description: 'Сайт ВКЛ/ВЫКЛ',
  })
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    example: 3600,
    description: 'Примерное время самовывоза, в секундах(?)',
  })
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  approxReadyTime?: number;

  @ApiProperty({
    example: 7200,
    description: 'Примерное время доставки, в секундах(?)',
  })
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  approxDeliveryTime?: number;
}
