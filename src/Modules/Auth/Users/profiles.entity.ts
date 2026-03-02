import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './users.entity';

@Entity({ name: 'Profiles' })
export class ProfileEntity {
  @PrimaryGeneratedColumn('rowid')
  id: string;
  //TODO: figure out what to store
  @Column()
  phoneNumber: string;

  @Column()
  email: string;

  @Column()
  address: string;

  @OneToOne(() => UserEntity, (user) => user.userProfile!, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
  @Column()
  userId: string;
}
