import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UserEntity } from './users.entity';
import { UserInputModel } from './users.dto';
import { HashService } from '../../Adapters/Crypto/bcrypt/bcrypt.adapter';
import { randomInt } from 'crypto';
import { CRYPTO_SYMBOL } from '../../Adapters/Crypto/crypto.interface';

@Injectable()
export class UsersService {
  constructor(
    private readonly repository: UsersRepository,
    @Inject(CRYPTO_SYMBOL)
    private readonly crypto: HashService,
  ) {}

  async createUser(user: UserInputModel): Promise<UserEntity> {
    if (await this.repository.findByPhoneNumber(user.phoneNumber)) {
      throw new ForbiddenException('Phone number already exists');
    }

    const newUser: UserEntity = UserEntity.createEntity(user);
    return await this.repository.save(newUser);
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.repository.softDelete(id);
  }

  async genNewCode(user: UserEntity): Promise<string> {
    const code = randomInt(1000, 9999).toString();
    user.confirmationData.newCode(await this.crypto.toHash(code));
    return code;
  }
}
