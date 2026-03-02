import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { HashService } from '../Adapters/Crypto/bcrypt/bcrypt.adapter';
import { UserInputModel } from './Users/users.dto';
import { UsersService } from './Users/users.service';
import { UserEntity } from './Users/users.entity';
import { UsersRepository } from './Users/users.repository';
import { v4 as uuidV4 } from 'uuid';
import { SessionEntity } from './session.entity';
import { oneSecond } from '../../Utils/dateHelpers';
import { SessionsRepository } from './session.repository';
import { JwtAdapter } from '../Adapters/JWT/jwt.adapter';
import { AdminEntity } from './Users/admin.entity';
import { AdminsRepository } from './Users/admin.repository';
import { CRYPTO_SYMBOL } from '../Adapters/Crypto/crypto.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersRepository: UsersRepository,
    private readonly adminsRepository: AdminsRepository,
    private readonly sessionsRepository: SessionsRepository,
    @Inject(CRYPTO_SYMBOL)
    private readonly crypto: HashService,
    private readonly jwt: JwtAdapter,
  ) {}

  async signUp(input: UserInputModel): Promise<string> {
    const user = await this.usersService.createUser(input);

    const code = await this.sendCodeForLogIn(user.phoneNumber!);

    return code!;
  }

  async sendCodeForLogIn(phoneNumber: string): Promise<string | null> {
    const user: UserEntity | null =
      await this.usersRepository.findByPhoneNumber(phoneNumber);
    if (!user) {
      return null;
    }

    const code = await this.usersService.genNewCode(user);
    await this.usersRepository.save(user);

    //TODO:SMS

    return code;
  }

  async logInWithCode(
    phoneNumber: string,
    code: string,
    reqMeta: { IP: string; userAgent: string },
  ): Promise<{
    accessToken: string;
    refreshToken: string;
  } | null> {
    const user: UserEntity | null =
      await this.usersRepository.findByPhoneNumber(phoneNumber);
    if (!user) {
      throw new NotFoundException('Phone number not found');
    }
    if (
      !(await this.crypto.compareHash(
        code,
        user.confirmationData.confirmationCode,
      ))
    ) {
      throw new UnauthorizedException('Incorrect confirmation code');
    }

    let prom: Promise<UserEntity> | null = null;
    if (!user.confirmationData.isConfirmed) {
      user.confirmationData.isConfirmed = true;
      prom = this.usersRepository.save(user);
    }
    const deviceId = uuidV4().toString();
    const { session, accessToken, refreshToken } = await this.createNewSession(
      user.id,
      deviceId,
      reqMeta,
    );
    if (!(await this.sessionsRepository.save(session))) {
      return null;
    }
    if (prom) {
      await prom;
    }
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async adminLogIn(login: string, password: string): Promise<string | null> {
    const admin: AdminEntity | null =
      await this.adminsRepository.findByLogin(login);
    if (!admin) {
      throw new NotFoundException('Login not found');
    }
    if (!(await this.crypto.compareHash(password, admin.password))) {
      throw new UnauthorizedException('Incorrect password');
    }

    return this.jwt.signAccessToken(admin.id, true /* diff lifespan */);
  }

  async RefreshToken(
    token: string,
    reqMeta: { IP: string; userAgent: string },
  ): Promise<{
    accessToken: string;
    refreshToken: string;
  } | null> {
    const payload = this.jwt.decodeRefreshJWT(token);
    if (!payload) {
      throw new UnauthorizedException('Incorrect token');
    }
    const { userId, deviceId } = payload;

    const user: UserEntity | null = await this.usersRepository.findById(userId);
    if (!user) {
      return null;
    }

    const { session, accessToken, refreshToken } = await this.createNewSession(
      user.id,
      deviceId,
      reqMeta,
    );
    await this.sessionsRepository.refreshSession(session);

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  private async createNewSession(
    userId: string,
    deviceId: string,
    reqMeta: { IP: string; userAgent: string },
  ): Promise<{
    session: SessionEntity;
    accessToken: string;
    refreshToken: string;
  }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAccessToken(userId),
      this.jwt.signRefreshToken(userId, deviceId),
    ]);

    const session: SessionEntity = SessionEntity.CreateDocument({
      ip: reqMeta.IP,
      title: reqMeta.userAgent || 'Unknown device',
      deviceId: deviceId,
      userId: userId,
      lastActiveDate: new Date(
        this.jwt.decodeRefreshJWT(refreshToken)!.iat * oneSecond,
      ),
      expDate: new Date(
        this.jwt.decodeRefreshJWT(refreshToken)!.exp * oneSecond,
      ),
    });
    return {
      session: session,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }
}
