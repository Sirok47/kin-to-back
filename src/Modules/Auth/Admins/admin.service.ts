import { Inject, Injectable } from '@nestjs/common';
import { AdminsRepository } from './admin.repository';
import { CRYPTO_SYMBOL } from '../../Adapters/Crypto/crypto.interface';
import { HashService } from '../../Adapters/Crypto/bcrypt/bcrypt.adapter';
import { AdminInputModel } from '../Users/users.dto';
import { AdminEntity } from './admin.entity';

@Injectable()
export class AdminsService {
  constructor(
    private readonly adminRepo: AdminsRepository,
    @Inject(CRYPTO_SYMBOL)
    private readonly crypto: HashService,
  ) {}

  async createAdmin(admin: AdminInputModel): Promise<AdminEntity> {
    admin.password = await this.crypto.toHash(admin.password);
    const newAdmin: AdminEntity = AdminEntity.createEntity(admin);
    return await this.adminRepo.save(newAdmin);
  }
}
