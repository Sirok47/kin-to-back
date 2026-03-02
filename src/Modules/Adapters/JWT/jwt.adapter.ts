import { Injectable } from '@nestjs/common';
import { config } from '../../../Settings/config';
import { JwtService } from '@nestjs/jwt';
import { accessTokenPayload, refreshTokenPayload } from './tokens.dto';

@Injectable()
export class JwtAdapter {
  constructor(private readonly jwt: JwtService) {}

  signAccessToken(
    userId: string,
    isAdmin: boolean = false,
    expTime: number = config.accessTokenLifeSpan,
  ): Promise<string> {
    return this.jwt.signAsync(
      { userId: userId, isAdmin: isAdmin },
      { expiresIn: expTime },
    );
  }

  signRefreshToken(
    userId: string,
    deviceId: string,
    isAdmin: boolean = false,
    expTime: number = config.refreshTokenLifeSpan,
  ): Promise<string> {
    return this.jwt.signAsync(
      { userId: userId, deviceId: deviceId, isAdmin: isAdmin },
      { expiresIn: expTime },
    );
  }

  decodeAccessJWT(token: string): accessTokenPayload | null {
    const payload = this.jwt.decode<accessTokenPayload>(token);
    if (!payload || !payload.userId || !payload.iat || !payload.exp) {
      return null;
    }
    return payload;
  }
  decodeRefreshJWT(token: string): refreshTokenPayload | null {
    const payload = this.jwt.decode<refreshTokenPayload>(token);
    if (
      !payload ||
      !payload.userId ||
      !payload.deviceId ||
      !payload.iat ||
      !payload.exp
    ) {
      return null;
    }
    return payload;
  }
}
