import { IsPhoneNumber, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserInputModel {
  @ApiProperty({
    example: '+74232497777',
    description: 'Телефонный номер пользователя',
  })
  @IsPhoneNumber('RU', { message: 'Unsupported phone number' })
  phoneNumber: string;
}

export class AdminInputModel {
  @ApiProperty({
    example: 'qwerty',
    description: 'Логин админа',
  })
  @Length(5, 20)
  login: string;

  @ApiProperty({
    example: 'pass123',
    description: 'Пароль админа',
  })
  @Length(5, 50)
  password: string;
}
