import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './Users/users.entity';
import { ProfileEntity } from './Users/profiles.entity';
import { UsersRepository } from './Users/users.repository';
import { HashModule } from '../Adapters/Crypto/crypto.module';
import { SessionEntity } from './session.entity';
import { JWTModule } from '../Adapters/JWT/jwt.module';
import { AdminEntity } from './Users/admin.entity';
import { ConfirmationDataEntity } from './Users/sms-confirmation.entity';
import { SessionsRepository } from './session.repository';
import { AuthService } from './auth.service';
import { UsersService } from './Users/users.service';
import { AuthController } from './auth.controller';
import { AdminsRepository } from './Users/admin.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      AdminEntity,
      ProfileEntity,
      ConfirmationDataEntity,
      SessionEntity,
    ]),
    JWTModule,
    HashModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    UsersRepository,
    SessionsRepository,
    AdminsRepository,
  ],
  exports: [],
})
export class AuthModule {}
