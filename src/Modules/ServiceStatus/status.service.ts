import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ServiceStatusEntity } from './status.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceStatusDTO } from './status.dto';

@Injectable()
export class StatusService {
  constructor(
    @InjectRepository(ServiceStatusEntity)
    private readonly repo: Repository<ServiceStatusEntity>,
  ) {}

  async getStatus(): Promise<ServiceStatusEntity> {
    const res = await this.repo.findOne({ order: { id: 'ASC' } });
    if (!res) {
      throw new InternalServerErrorException('No repository found.');
    }
    return res;
  }

  async updateStatus(upd: ServiceStatusDTO): Promise<void> {
    const status = await this.getStatus();
    Object.assign(status, upd);
    await this.repo.save(status);
  }
}
