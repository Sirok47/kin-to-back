import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { config } from '../../../Settings/config';
import { JwtAdapter } from './jwt.adapter';

@Module({
  imports: [JwtModule.register({ global: true, secret: config.SECRET_KEY })],
  providers: [JwtAdapter],
  exports: [JwtAdapter],
})
export class JWTModule {}
