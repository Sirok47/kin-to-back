import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './Users/users.entity';
import { ProfileEntity } from './Users/ProfileInfo/profiles.entity';
import { UsersRepository } from './Users/users.repository';
import { HashModule } from '../Adapters/Crypto/crypto.module';
import { SessionEntity } from './session.entity';
import { JWTModule } from '../Adapters/JWT/jwt.module';
import { AdminEntity } from './Admins/admin.entity';
import { ConfirmationDataEntity } from './Users/sms-confirmation.entity';
import { SessionsRepository } from './session.repository';
import { AuthService } from './auth.service';
import { UsersService } from './Users/users.service';
import { AuthController } from './auth.controller';
import { AdminsRepository } from './Admins/admin.repository';
import { AdminsService } from './Admins/admin.service';
import { ProfilesController } from './Users/ProfileInfo/profiles.controller';
import { UserInfoService } from './Users/ProfileInfo/profiles.service';

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
  controllers: [AuthController, ProfilesController],
  providers: [
    UserInfoService,
    AuthService,
    AdminsService,
    UsersService,
    UsersRepository,
    SessionsRepository,
    AdminsRepository,
  ],
  exports: [],
})
export class AuthModule {}
