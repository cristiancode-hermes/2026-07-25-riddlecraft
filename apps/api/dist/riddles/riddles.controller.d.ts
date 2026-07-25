import { RiddlesService } from './riddles.service';
import { CreateRiddleDto, UpdateRiddleDto, RateRiddleDto, QueryRiddlesDto } from './dto/riddle.dto';
export declare class RiddlesController {
    private readonly riddlesService;
    constructor(riddlesService: RiddlesService);
    getDailyRiddle(user: any): Promise<{
        riddle: null;
        solved: boolean;
        attempt?: undefined;
    } | {
        riddle: import("./riddle.entity").Riddle;
        solved: boolean;
        attempt: null;
    }>;
    findAll(query: QueryRiddlesDto): Promise<{
        items: import("./riddle.entity").Riddle[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<{
        error: {
            statusCode: number;
            message: string;
        };
        riddle?: undefined;
    } | {
        riddle: import("./riddle.entity").Riddle;
        error?: undefined;
    }>;
    create(user: any, dto: CreateRiddleDto): Promise<{
        riddle: import("./riddle.entity").Riddle;
    }>;
    update(user: any, id: string, dto: UpdateRiddleDto): Promise<{
        error: {
            statusCode: number;
            message: string;
        };
        riddle?: undefined;
    } | {
        riddle: import("./riddle.entity").Riddle;
        error?: undefined;
    }>;
    delete(user: any, id: string): Promise<{
        error: {
            statusCode: number;
            message: string;
        };
        success?: undefined;
    } | {
        success: boolean;
        error?: undefined;
    }>;
    rate(id: string, dto: RateRiddleDto): Promise<{
        riddle: import("./riddle.entity").Riddle;
    }>;
}
//# sourceMappingURL=riddles.controller.d.ts.map