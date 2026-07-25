import { Repository } from 'typeorm';
import { SolveAttempt } from './solve-attempt.entity';
import { RiddlesService } from '../riddles/riddles.service';
import { HintsService } from '../hints/hints.service';
import { UsersService } from '../users/users.service';
import { DailyRiddleService } from '../daily-riddle/daily-riddle.service';
import { Hint } from '../hints/hint.entity';
export declare class SolveAttemptsService {
    private readonly repo;
    private readonly hintRepo;
    private readonly riddlesService;
    private readonly hintsService;
    private readonly usersService;
    private readonly dailyRiddleService;
    constructor(repo: Repository<SolveAttempt>, hintRepo: Repository<Hint>, riddlesService: RiddlesService, hintsService: HintsService, usersService: UsersService, dailyRiddleService: DailyRiddleService);
    findById(id: string): Promise<SolveAttempt | null>;
    findByUserAndRiddle(userId: string, riddleId: string): Promise<SolveAttempt | null>;
    createOrUpdate(userId: string, riddleId: string, dailyRiddleId?: string): Promise<SolveAttempt>;
    submitAnswer(attemptId: string, answer: string): Promise<{
        correct: boolean;
        attempt: SolveAttempt;
        score?: number;
        newAchievements?: any[];
        levelUp?: boolean;
    }>;
    requestHint(attemptId: string): Promise<{
        hint: Hint;
        penalty: number;
    } | null>;
    calculateScore(difficulty: string, timeSeconds: number, streak: number, hintsUsed: number): number;
    countSolvedByUser(userId: string): Promise<number>;
    findSolvedByUser(userId: string): Promise<SolveAttempt[]>;
    averageTimeByUser(userId: string): Promise<number>;
    currentStreak(userId: string): Promise<number>;
    maxStreak(userId: string): Promise<number>;
    getHistory(userId: string, page?: number, limit?: number): Promise<{
        items: SolveAttempt[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getLeaderboardDaily(date: string, limit?: number): Promise<SolveAttempt[]>;
    getLeaderboardAllTime(limit?: number): Promise<any[]>;
}
//# sourceMappingURL=solve-attempts.service.d.ts.map