import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAchievement } from './user-achievement.entity';

@Injectable()
export class UserAchievementsService {
  constructor(
    @InjectRepository(UserAchievement)
    private readonly repo: Repository<UserAchievement>,
  ) {}

  async findByUserId(userId: string): Promise<UserAchievement[]> {
    return this.repo.find({ where: { userId } });
  }

  async findByUserIdWithAchievement(userId: string): Promise<UserAchievement[]> {
    return this.repo.find({
      where: { userId },
      relations: { achievement: true },
    });
  }

  async create(userId: string, achievementId: string): Promise<UserAchievement> {
    const entity = this.repo.create({ userId, achievementId });
    return this.repo.save(entity) as unknown as UserAchievement;
  }

  async hasAchievement(userId: string, achievementId: string): Promise<boolean> {
    const count = await this.repo.count({ where: { userId, achievementId } });
    return count > 0;
  }

  async countByUserId(userId: string): Promise<number> {
    return this.repo.count({ where: { userId } });
  }
}
