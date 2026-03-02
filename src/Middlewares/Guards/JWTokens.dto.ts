import { Request } from 'express';
import { UnauthorizedException } from '@nestjs/common';

export function extractAccessToken(request: Request): string {
  const authHeader = request.headers['authorization'];
  if (!authHeader) {
    throw new UnauthorizedException('Authorization header missing');
  }

  const [bearer, token] = authHeader.split(' ');
  if (bearer !== 'Bearer' || !token) {
    throw new UnauthorizedException(
      'Invalid authorization format. Expected "Bearer <token>"',
    );
  }

  return token;
}
