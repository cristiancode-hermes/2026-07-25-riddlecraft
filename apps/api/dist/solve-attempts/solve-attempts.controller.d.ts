import { SolveAttemptsService } from './solve-attempts.service';
import { SubmitAnswerDto } from './dto/solve-attempt.dto';
import { RiddlesService } from '../riddles/riddles.service';
export declare class SolveAttemptsController {
    private readonly solveAttemptsService;
    private readonly riddlesService;
    constructor(solveAttemptsService: SolveAttemptsService, riddlesService: RiddlesService);
    createAttempt(user: any, riddleId: string): Promise<{
        attempt: import("./solve-attempt.entity").SolveAttempt;
    }>;
    submitAnswer(id: string, dto: SubmitAnswerDto): Promise<{
        correct: boolean;
        attempt: import("./solve-attempt.entity").SolveAttempt;
        score?: number;
        newAchievements?: any[];
        levelUp?: boolean;
    }>;
    requestHint(id: string): Promise<{
        hint: import("../hints/hint.entity").Hint;
        penalty: number;
    } | {
        hint: null;
        message: string;
    }>;
    getAttempt(id: string): Promise<{
        error: {
            statusCode: number;
            message: string;
        };
        attempt?: undefined;
    } | {
        attempt: import("./solve-attempt.entity").SolveAttempt;
        error?: undefined;
    }>;
    getHistory(user: any, page?: number, limit?: number): Promise<{
        items: import("./solve-attempt.entity").SolveAttempt[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
}
//# sourceMappingURL=solve-attempts.controller.d.ts.map