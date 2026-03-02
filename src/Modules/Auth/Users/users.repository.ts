import { Injectable } from '@nestjs/common';
import { UserEntity } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
  ) {}

  async save(user: UserEntity): Promise<UserEntity> {
    return this.userRepo.save(user);
  }

  async findById(id: string): Promise<UserEntity | null> {
    return this.userRepo.findOne({
      relations: { userProfile: true },
      where: { id: id },
    });
  }

  async findByPhoneNumber(phoneNumber: string): Promise<UserEntity | null> {
    return this.userRepo.findOne({
      relations: { confirmationData: true },
      where: { phoneNumber: phoneNumber },
    });
  }

  async softDelete(id: string): Promise<boolean> {
    const result = await this.userRepo.softDelete({ id: id });
    return !!result.affected;
  }

  async restore(id: string): Promise<boolean> {
    const result = await this.userRepo.restore({ id: id });
    return !!result.affected;
  }

  async deleteAll(): Promise<void> {
    await this.userRepo.deleteAll();
  }
}
