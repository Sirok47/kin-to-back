import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class BannerInputModel {
  @ApiProperty({
    example: 'data:image/jpeg;base64,...',
    description: 'Картинка баннера в base64!',
  })
  @IsString()
  banner: string;
}

export class BannerViewModel {
  @ApiProperty({
    example: [
      'https://msbgqrxjlaikpywovuvj.storage.supabase.co/storage/v1/object/public/Kin-to_stash/1764265127824.png',
    ],
    description: 'Массив ссылок на облако с картинками баннеров',
  })
  bannerLinks: string[];
}

export class bannerId {
  @Type(() => Number)
  @IsNumber()
  id: number;
}
