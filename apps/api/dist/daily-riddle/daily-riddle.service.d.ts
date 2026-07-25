import { Repository } from 'typeorm';
import { DailyRiddle } from './daily-riddle.entity';
export declare class DailyRiddleService {
    private readonly repo;
    constructor(repo: Repository<DailyRiddle>);
    findToday(date: string): Promise<DailyRiddle | null>;
    findAll(): Promise<DailyRiddle[]>;
    create(data: Partial<DailyRiddle>): Promise<DailyRiddle>;
    delete(id: string): Promise<void>;
    getCurrentStreak(userId: string, solveRepo: any): Promise<number>;
}
//# sourceMappingURL=daily-riddle.service.d.ts.map