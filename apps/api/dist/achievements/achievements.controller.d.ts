import { AchievementsService } from './achievements.service';
import { UserAchievementsService } from '../user-achievements/user-achievements.service';
export declare class AchievementsController {
    private readonly achievementsService;
    private readonly userAchievementsService;
    constructor(achievementsService: AchievementsService, userAchievementsService: UserAchievementsService);
    findAll(): Promise<{
        items: import("./achievement.entity").Achievement[];
    }>;
    getUserAchievements(): Promise<{
        items: never[];
    }>;
    findOne(id: string): Promise<import("./achievement.entity").Achievement | {
        error: {
            statusCode: number;
            message: string;
        };
    }>;
}
//# sourceMappingURL=achievements.controller.d.ts.map