import { AdminService } from './admin.service';
import { SetDailyRiddleDto } from '../daily-riddle/dto/daily-riddle.dto';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getStats(): Promise<{
        userCount: number;
        riddleCount: number;
        dailySolveCount: number;
        reportsCount: number;
    }>;
    getReports(): Promise<{
        items: import("../riddles/riddle.entity").Riddle[];
    }>;
    approveRiddle(id: string): Promise<{
        success: boolean;
    }>;
    rejectRiddle(id: string): Promise<{
        success: boolean;
    }>;
    banUser(id: string): Promise<{
        success: boolean;
    }>;
    setDailyRiddle(dto: SetDailyRiddleDto): Promise<import("../daily-riddle/daily-riddle.entity").DailyRiddle | null>;
    getDailySchedule(): Promise<{
        items: {
            id: string;
            riddleId: string;
            riddleTitle: string;
            date: string;
            bonusMultiplier: number;
        }[];
    }>;
    deleteDaily(id: string): Promise<{
        success: boolean;
    }>;
}
//# sourceMappingURL=admin.controller.d.ts.map