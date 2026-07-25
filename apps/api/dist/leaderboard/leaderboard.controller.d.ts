import { SolveAttemptsService } from '../solve-attempts/solve-attempts.service';
export declare class LeaderboardController {
    private readonly solveAttemptsService;
    constructor(solveAttemptsService: SolveAttemptsService);
    dailyLeaderboard(user: any): Promise<{
        items: {
            rank: number;
            username: string;
            score: number;
            timeSeconds: number;
            hintsUsed: number;
        }[];
        userPosition: {
            rank: number;
            username: string;
            score: number;
            timeSeconds: number;
            hintsUsed: number;
        } | undefined;
    }>;
    allTimeLeaderboard(user: any): Promise<{
        items: {
            rank: number;
            username: any;
            score: number;
            totalSolved: number;
            averageTime: number;
        }[];
        userPosition: {
            rank: number;
            username: any;
            score: number;
            totalSolved: number;
            averageTime: number;
        } | undefined;
    }>;
}
//# sourceMappingURL=leaderboard.controller.d.ts.map