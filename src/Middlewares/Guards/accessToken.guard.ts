import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { extractAccessToken } from './JWTokens.dto';
import { accessTokenPayload } from '../../Modules/Adapters/JWT/tokens.dto';

@Injectable()
export class UserAuthGuard implements CanActivate {
  constructor(private jwt: JwtService) {}
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const token = extractAccessToken(request);

    const payload: accessTokenPayload = this.jwt.decode(token);
    if (!payload.userId) {
      throw new UnauthorizedException();
    }
    request.params.userId = payload.userId;
    return true;
  }
}
