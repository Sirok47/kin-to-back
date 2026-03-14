import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../users.entity';
import { ProfileViewModel } from './profiles.dto';

@Entity({ name: 'Profiles' })
export class ProfileEntity {
  @PrimaryGeneratedColumn('rowid')
  id: string;
  //TODO: figure out what to store
  @Column('varchar', { nullable: true, length: 50 })
  name: string | null;

  @Column('varchar', { nullable: true, length: 50 })
  email: string | null;

  @Column('varchar', { nullable: true, length: 200 })
  address: string | null;

  @OneToOne(() => UserEntity, (user) => user.userProfile!, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
  @Column()
  userId: string;

  mapToViewModel(): ProfileViewModel {
    return {
      name: this.name ?? 'Не установлен',
      email: this.email ?? 'Не установлен',
      address: this.address ?? 'Не установлен',
      phoneNumber: this.user.phoneNumber,
    };
  }
}
