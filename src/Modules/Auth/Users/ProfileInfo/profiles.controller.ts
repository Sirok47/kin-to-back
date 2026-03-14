import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserInfoService } from './profiles.service';
import { ProfileInputModel, ProfileViewModel } from './profiles.dto';
import { UserAuthGuard } from '../../../../Middlewares/Guards/accessToken.guard';

@ApiTags('User profile')
@UseGuards(UserAuthGuard)
@Controller('user-info')
export class ProfilesController {
  constructor(private readonly service: UserInfoService) {}

  @ApiResponse({
    status: 200,
    description: 'Возвращает профиль пользователя по его токену.',
    type: ProfileViewModel,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiBearerAuth()
  @Get()
  @HttpCode(HttpStatus.OK)
  async getInfo(@Param('userId') userId: string): Promise<ProfileViewModel> {
    return (await this.service.getInfoById(userId)).mapToViewModel();
  }

  // @ApiResponse({
  //   status: 201,
  //   description: 'Установлен новый адрес',
  // })
  // @ApiResponse({
  //   status: 401,
  //   description: 'Unauthorized',
  // })
  // @ApiBearerAuth()
  // @Post()
  // @HttpCode(HttpStatus.CREATED)
  // async assertAddress(@Param('userId') userId: string): Promise<void> {
  //   this.service.updateProfile(userId, ???)
  // }

  @ApiBody({ type: ProfileInputModel })
  @ApiResponse({
    status: 200,
    description: 'Возвращает обновленный профиль пользователя по его токену.',
    type: ProfileViewModel,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiBearerAuth()
  @Put()
  @HttpCode(HttpStatus.OK)
  async updateProfile(
    @Param('userId') userId: string,
    @Body() newProfile: ProfileInputModel,
  ): Promise<ProfileViewModel> {
    return (
      await this.service.updateProfile(userId, newProfile)
    ).mapToViewModel();
  }
}
