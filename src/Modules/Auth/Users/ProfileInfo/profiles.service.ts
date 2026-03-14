import { Injectable, NotFoundException } from '@nestjs/common';
import { ProfileEntity } from './profiles.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileInputModel } from './profiles.dto';

@Injectable()
export class UserInfoService {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly repo: Repository<ProfileEntity>,
  ) {}

  async getInfoById(userId: string): Promise<ProfileEntity> {
    const profile: ProfileEntity | null = await this.repo.findOneBy({
      userId: userId,
    });
    if (!profile) {
      throw new NotFoundException('User not found');
    }
    return profile;
  }

  async updateProfile(
    userId: string,
    newProfile: ProfileInputModel,
  ): Promise<ProfileEntity> {
    const profile: ProfileEntity | null = await this.repo.findOneBy({
      userId: userId,
    });
    if (!profile) {
      throw new NotFoundException('User not found');
    }
    Object.assign(profile, newProfile);
    return this.repo.save(profile);
  }
}
