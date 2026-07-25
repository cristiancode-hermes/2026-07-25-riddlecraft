import { User } from '../users/user.entity';
import { Achievement } from '../achievements/achievement.entity';
export declare class UserAchievement {
    id: string;
    userId: string;
    user?: User;
    achievementId: string;
    achievement?: Achievement;
    unlockedAt: Date;
}
//# sourceMappingURL=user-achievement.entity.d.ts.map