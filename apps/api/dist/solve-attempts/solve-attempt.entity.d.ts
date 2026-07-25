import { User } from '../users/user.entity';
import { Riddle } from '../riddles/riddle.entity';
import { DailyRiddle } from '../daily-riddle/daily-riddle.entity';
export declare class SolveAttempt {
    id: string;
    userId: string;
    user?: User;
    riddleId: string;
    riddle?: Riddle;
    dailyRiddleId?: string;
    dailyRiddle?: DailyRiddle;
    solved: boolean;
    hintsUsed: number;
    timeSeconds: number;
    score: number;
    attempts: number;
    startedAt: Date;
    completedAt?: Date;
}
//# sourceMappingURL=solve-attempt.entity.d.ts.map