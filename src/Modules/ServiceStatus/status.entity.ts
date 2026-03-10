import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ServiceStatusViewModel } from './status.dto';

@Entity({ name: 'ServiceStatus' })
export class ServiceStatusEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'boolean' })
  isActive: boolean;

  @Column({ type: 'time' })
  //TODO better name
  approxReadyTime: number;

  @Column({ type: 'time' })
  approxDeliveryTime: number;

  mapToViewModel(): ServiceStatusViewModel {
    return {
      isActive: this.isActive,
      approxReadyTime: this.approxReadyTime,
      approxDeliveryTime: this.approxDeliveryTime,
    };
  }
}
