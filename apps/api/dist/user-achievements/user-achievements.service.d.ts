import { Repository } from 'typeorm';
import { UserAchievement } from './user-achievement.entity';
export declare class UserAchievementsService {
    private readonly repo;
    constructor(repo: Repository<UserAchievement>);
    findByUserId(userId: string): Promise<UserAchievement[]>;
    findByUserIdWithAchievement(userId: string): Promise<UserAchievement[]>;
    create(userId: string, achievementId: string): Promise<UserAchievement>;
    hasAchievement(userId: string, achievementId: string): Promise<boolean>;
    countByUserId(userId: string): Promise<number>;
}
//# sourceMappingURL=user-achievements.service.d.ts.map