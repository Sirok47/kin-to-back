import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from './Users/users.entity';

export interface ISession {
  ip: string;
  title: string;
  lastActiveDate: Date;
  expDate: Date;
  deviceId: string;
  userId: string;
}

@Entity({ name: 'Sessions' })
export class SessionEntity implements ISession {
  @Column('varchar', { length: 20 })
  ip: string;

  @Column('varchar', { length: 150 })
  title: string;

  @Column('timestamp with time zone', { default: () => 'CURRENT_TIMESTAMP' })
  lastActiveDate: Date;

  @Column('timestamp with time zone')
  expDate: Date;

  @PrimaryColumn('uuid')
  deviceId: string;

  @ManyToOne(() => UserEntity, (user) => user.sessions)
  user: UserEntity;
  @Column()
  userId: string;

  static CreateDocument(session: ISession): SessionEntity {
    const doc = new this();
    doc.ip = session.ip;
    doc.title = session.title;
    doc.lastActiveDate = session.lastActiveDate;
    doc.expDate = session.expDate;
    doc.deviceId = session.deviceId;
    doc.user.id = session.userId;
    doc.userId = session.userId;
    return doc;
  }
}
