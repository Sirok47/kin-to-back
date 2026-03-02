import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SessionsRepository } from '../../Modules/Auth/session.repository';
import { oneSecond } from '../../Utils/dateHelpers';
import { Request } from 'express';
import { JwtAdapter } from '../../Modules/Adapters/JWT/jwt.adapter';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private jwt: JwtAdapter,
    private sessionRepo: SessionsRepository,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    if (!req.cookies.refreshToken) {
      throw new UnauthorizedException();
    }
    //TODO
    const token = req.cookies.refreshToken as string;
    const payload = this.jwt.decodeRefreshJWT(token);
    if (!payload) {
      throw new UnauthorizedException();
    }
    const { userId, deviceId, iat, exp } = payload;
    if (!userId || !deviceId || !iat || !exp || exp * oneSecond < Date.now()) {
      throw new UnauthorizedException();
    }
    if (
      !(await this.sessionRepo.checkPresenceInTheList(
        userId,
        deviceId,
        new Date(iat * oneSecond),
      ))
    ) {
      throw new UnauthorizedException();
    }
    req.params.userId = userId;
    req.params.deviceId = deviceId;
    return true;
  }
}
