import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminEntity } from './admin.entity';

@Injectable()
export class AdminsRepository {
  constructor(
    @InjectRepository(AdminEntity) private adminRepo: Repository<AdminEntity>,
  ) {}

  async save(admin: AdminEntity): Promise<AdminEntity> {
    return this.adminRepo.save(admin);
  }

  async findById(id: string): Promise<AdminEntity | null> {
    return this.adminRepo.findOne({
      where: { id: id },
    });
  }

  async findByLogin(login: string): Promise<AdminEntity | null> {
    return this.adminRepo.findOne({
      where: { login: login },
    });
  }

  async softDelete(id: string): Promise<boolean> {
    const result = await this.adminRepo.softDelete({ id: id });
    return !!result.affected;
  }

  async restore(id: string): Promise<boolean> {
    const result = await this.adminRepo.restore({ id: id });
    return !!result.affected;
  }

  async deleteAll(): Promise<void> {
    await this.adminRepo.deleteAll();
  }
}
