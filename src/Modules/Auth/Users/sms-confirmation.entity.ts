import { UserEntity } from './users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { addOneDay } from '../../../Utils/dateHelpers';

@Entity('ConfirmationData')
export class ConfirmationDataEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 100 })
  confirmationCode: string;

  @Column('timestamp with time zone', { default: () => 'CURRENT_TIMESTAMP' })
  confirmationCodeExpDate: Date;

  @Column('boolean', { default: false })
  isConfirmed: boolean = false;

  @OneToOne(() => UserEntity, (user) => user.confirmationData, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column()
  userId: string;

  newCode(code: string) {
    this.confirmationCode = code;
    this.confirmationCodeExpDate = addOneDay(new Date());
  }
}
