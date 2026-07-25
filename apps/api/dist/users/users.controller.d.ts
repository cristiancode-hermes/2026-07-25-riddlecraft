import { UsersService } from './users.service';
import { SolveAttemptsService } from '../solve-attempts/solve-attempts.service';
import { UserAchievementsService } from '../user-achievements/user-achievements.service';
import { AchievementsService } from '../achievements/achievements.service';
export declare class UsersController {
    private readonly usersService;
    private readonly solveAttemptsService;
    private readonly userAchievementsService;
    private readonly achievementsService;
    constructor(usersService: UsersService, solveAttemptsService: SolveAttemptsService, userAchievementsService: UserAchievementsService, achievementsService: AchievementsService);
    getProfile(username: string): Promise<{
        error: {
            statusCode: number;
            message: string;
        };
        user?: undefined;
        stats?: undefined;
    } | {
        user: {
            id: string;
            username: string;
            xp: number;
            level: number;
            role: string;
            createdAt: string;
        };
        stats: {
            xp: number;
            level: number;
            currentLevelXp: number;
            nextLevelXp: number;
            currentStreak: number;
            maxStreak: number;
            totalSolved: number;
            totalRiddlesCreated: number;
            achievementsUnlocked: number;
            achievementsTotal: number;
            averageTime: number;
        };
        error?: undefined;
    }>;
    getUserSolves(username: string): Promise<{
        error: {
            statusCode: number;
            message: string;
        };
        items?: undefined;
    } | {
        items: {
            id: string;
            riddleId: string;
            solved: boolean;
            score: number;
            timeSeconds: number;
            hintsUsed: number;
            completedAt: string | undefined;
        }[];
        error?: undefined;
    }>;
    getUserAchievements(username: string): Promise<{
        error: {
            statusCode: number;
            message: string;
        };
        items?: undefined;
    } | {
        items: import("../user-achievements/user-achievement.entity").UserAchievement[];
        error?: undefined;
    }>;
}
//# sourceMappingURL=users.controller.d.ts.map