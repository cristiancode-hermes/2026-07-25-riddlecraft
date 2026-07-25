import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Riddle } from '../riddles/riddle.entity';
import { SolveAttempt } from '../solve-attempts/solve-attempt.entity';
import { DailyRiddle } from '../daily-riddle/daily-riddle.entity';
export declare class AdminService {
    private readonly userRepo;
    private readonly riddleRepo;
    private readonly solveRepo;
    private readonly dailyRepo;
    constructor(userRepo: Repository<User>, riddleRepo: Repository<Riddle>, solveRepo: Repository<SolveAttempt>, dailyRepo: Repository<DailyRiddle>);
    getStats(): Promise<{
        userCount: number;
        riddleCount: number;
        dailySolveCount: number;
        reportsCount: number;
    }>;
    getReports(): Promise<Riddle[]>;
    approveRiddle(id: string): Promise<import("typeorm").UpdateResult>;
    rejectRiddle(id: string): Promise<import("typeorm").UpdateResult>;
    banUser(id: string): Promise<import("typeorm").UpdateResult>;
    setDailyRiddle(data: {
        riddleId: string;
        date: string;
        bonusMultiplier?: number;
    }): Promise<DailyRiddle | null>;
    getDailySchedule(): Promise<{
        id: string;
        riddleId: string;
        riddleTitle: string;
        date: string;
        bonusMultiplier: number;
    }[]>;
    deleteDaily(id: string): Promise<void>;
}
//# sourceMappingURL=admin.service.d.ts.map