import { ISession, SessionEntity } from './session.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';

@Injectable()
export class SessionsRepository {
  constructor(
    @InjectRepository(SessionEntity)
    private readonly repo: Repository<SessionEntity>,
  ) {}

  async getSessionByDeviceId(deviceId: string): Promise<SessionEntity | null> {
    return this.repo.findOneBy({ deviceId });
  }

  async save(session: ISession): Promise<SessionEntity> {
    return this.repo.save(session);
  }

  async refreshSession(newSession: SessionEntity): Promise<boolean> {
    const result = await this.repo.update(
      {
        deviceId: newSession.deviceId,
        user: { id: newSession.userId },
      },
      newSession,
    );
    return !!result.affected;
  }

  async checkPresenceInTheList(
    userId: string,
    deviceId: string,
    issuedAt: Date,
  ): Promise<boolean> {
    return this.repo.existsBy({
      user: { id: userId },
      deviceId: deviceId,
      lastActiveDate: issuedAt,
    });
  }

  async terminateAllButOne(userId: string, deviceId: string): Promise<boolean> {
    return !!(await this.repo.delete({
      deviceId: Not(deviceId),
      userId: userId,
    }));
  }

  async terminateSession(deviceId: string): Promise<boolean> {
    return !!(await this.repo.delete(deviceId));
  }

  async deleteAll(): Promise<void> {
    await this.repo.deleteAll();
  }
}
