import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProfileEntity } from './ProfileInfo/profiles.entity';
import { UserInputModel } from './users.dto';
import { SessionEntity } from '../session.entity';
import { ConfirmationDataEntity } from './sms-confirmation.entity';

@Entity({ name: 'Users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 30 })
  phoneNumber: string;

  @Column('timestamp with time zone', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToOne(() => ProfileEntity, (profile) => profile.user, {
    cascade: true,
    nullable: true,
  })
  userProfile: ProfileEntity | null;

  @OneToOne(() => ConfirmationDataEntity, (data) => data.user, {
    cascade: true,
  })
  confirmationData: ConfirmationDataEntity;

  @OneToMany(() => SessionEntity, (session) => session.user)
  sessions: SessionEntity[];

  static createEntity(inputUser: UserInputModel): UserEntity {
    const entity = new UserEntity();
    entity.phoneNumber = inputUser.phoneNumber;
    entity.userProfile = new ProfileEntity();
    entity.confirmationData = new ConfirmationDataEntity();
    return entity;
  }
}
