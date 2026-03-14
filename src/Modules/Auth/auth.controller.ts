import {
  ApiBearerAuth,
  ApiBody,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdminInputModel, UserInputModel } from './Users/users.dto';
import { IsUUID } from 'class-validator';
import { type Request, type Response } from 'express';
import { config } from '../../Settings/config';
import { RefreshTokenGuard } from '../../Middlewares/Guards/refreshToken.guard';

class codeBody {
  @ApiProperty({ type: String })
  @IsUUID('4')
  code: string;
}

class tokenResponse {
  @ApiProperty({ type: String })
  accessToken: string;
}

//TODO: 429
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({ type: UserInputModel })
  @ApiResponse({
    status: 201,
    //TODO: Перейти на СМС
    description:
      'Регистрирует нового пользователя и высылает код подтверждения по СМС. (пока что код приходит в ответе на этот запрос)',
    type: codeBody,
  })
  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() user: UserInputModel): Promise<codeBody> {
    return { code: await this.authService.signUp(user) };
  }

  @ApiBody({ type: UserInputModel })
  @ApiResponse({
    status: 200,
    description:
      'Высылает код подтверждения по СМС. (пока что код приходит в ответе на этот запрос)',
    type: codeBody,
  })
  @ApiResponse({
    status: 404,
    description: 'Phone number not found',
  })
  @Post('/sendCode')
  @HttpCode(HttpStatus.OK)
  async sendCode(@Body() { phoneNumber }: UserInputModel): Promise<codeBody> {
    const code = await this.authService.sendCodeForLogIn(phoneNumber);
    if (!code) {
      throw new NotFoundException('Phone number not found');
    }
    return { code: code };
  }

  @ApiResponse({
    status: 200,
    description: 'Возвращает Access Token если код верный',
    type: tokenResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Phone number not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Incorrect confirmation code',
  })
  @Post('/code/:number')
  @HttpCode(HttpStatus.OK)
  async acceptCode(
    @Param() { phoneNumber }: UserInputModel,
    @Body() { code }: codeBody,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<tokenResponse> {
    const tokenPair = await this.authService.logInWithCode(phoneNumber, code, {
      IP: req.ip!,
      userAgent: req.header('user-agent')!,
    });
    if (!tokenPair) {
      throw new UnauthorizedException();
    }
    const result = {
      accessToken: tokenPair.accessToken,
    };
    res.cookie('refreshToken', tokenPair.refreshToken, {
      httpOnly: true,
      secure: true,
      domain: config.CURRENT_URL,
      path: config.COOKIE_PATH,
    });
    return result;
  }

  @ApiResponse({
    status: 200,
    description: 'Возвращает новую пару токенов',
    type: tokenResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid refresh token',
  })
  @ApiBearerAuth()
  @UseGuards(RefreshTokenGuard)
  @Post('/code/:number')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<tokenResponse> {
    const tokenPair = await this.authService.RefreshToken(
      req.cookies.refreshToken,
      {
        IP: req.ip!,
        userAgent: req.header('user-agent')!,
      },
    );
    if (!tokenPair) {
      throw new UnauthorizedException();
    }
    const result = {
      accessToken: tokenPair.accessToken,
    };
    res.cookie('refreshToken', tokenPair.refreshToken, {
      httpOnly: true,
      secure: true,
      domain: config.CURRENT_URL,
      path: config.COOKIE_PATH,
    });
    return result;
  }

  @ApiResponse({
    status: 200,
    description: 'Возвращает Access Token если пароль верный',
    type: tokenResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Login not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Incorrect password',
  })
  @Post('/admin')
  @HttpCode(HttpStatus.OK)
  async adminLogIn(
    @Body() { login, password }: AdminInputModel,
  ): Promise<tokenResponse> {
    const token: string | null = await this.authService.adminLogIn(
      login,
      password,
    );
    if (!token) {
      throw new NotFoundException('Login not found');
    }
    return { accessToken: token };
  }
}
