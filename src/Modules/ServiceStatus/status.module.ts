import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceStatusEntity } from './status.entity';
import { ServiceStatusController } from './status.controller';
import { StatusService } from './status.service';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceStatusEntity])],
  controllers: [ServiceStatusController],
  providers: [StatusService],
  exports: [],
})
export class ServiceStatusModule {}
