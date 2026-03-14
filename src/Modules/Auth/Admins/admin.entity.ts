import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AdminInputModel } from '../Users/users.dto';

@Entity({ name: 'Admins' })
export class AdminEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 255 })
  login: string;

  @Column('varchar', { length: 255 })
  password: string;

  @Column('timestamp with time zone', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date | null;

  static createEntity(inputUser: AdminInputModel): AdminEntity {
    const entity = new AdminEntity();
    entity.login = inputUser.login;
    entity.password = inputUser.password;
    return entity;
  }
}
