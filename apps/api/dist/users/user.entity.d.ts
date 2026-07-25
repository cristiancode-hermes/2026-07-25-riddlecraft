import { SolveAttempt } from '../solve-attempts/solve-attempt.entity';
import { UserAchievement } from '../user-achievements/user-achievement.entity';
import { Comment } from '../comments/comment.entity';
export declare class User {
    id: string;
    username: string;
    email: string;
    passwordHash: string;
    xp: number;
    level: number;
    role: string;
    createdAt: Date;
    updatedAt: Date;
    attempts?: SolveAttempt[];
    achievements?: UserAchievement[];
    comments?: Comment[];
}
//# sourceMappingURL=user.entity.d.ts.map