import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UserEntity } from './users.entity';
import { AdminInputModel, UserInputModel } from './users.dto';
import { HashService } from '../../Adapters/Crypto/bcrypt/bcrypt.adapter';
import { randomInt } from 'crypto';
import { AdminEntity } from './admin.entity';
import { AdminsRepository } from './admin.repository';
import { CRYPTO_SYMBOL } from '../../Adapters/Crypto/crypto.interface';

@Injectable()
export class UsersService {
  constructor(
    private readonly repository: UsersRepository,
    private readonly adminRepo: AdminsRepository,
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

  async createAdmin(admin: AdminInputModel): Promise<AdminEntity> {
    admin.password = await this.crypto.toHash(admin.password);
    const newAdmin: AdminEntity = AdminEntity.createEntity(admin);
    return await this.adminRepo.save(newAdmin);
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
