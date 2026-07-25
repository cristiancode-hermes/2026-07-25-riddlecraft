import { Repository } from 'typeorm';
import { Riddle } from './riddle.entity';
import { Hint } from '../hints/hint.entity';
export declare class RiddlesService {
    private readonly repo;
    private readonly hintRepo;
    constructor(repo: Repository<Riddle>, hintRepo: Repository<Hint>);
    findAll(query: {
        category?: string;
        difficulty?: string;
        search?: string;
        sort?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        items: Riddle[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findById(id: string, withHints?: boolean): Promise<Riddle | null>;
    findDailyRiddle(): Promise<Riddle | null>;
    create(data: Partial<Riddle>, hints?: Partial<Hint>[]): Promise<Riddle>;
    update(id: string, data: Partial<Riddle>, hints?: Partial<Hint>[]): Promise<Riddle>;
    delete(id: string): Promise<void>;
    rate(id: string, rating: number): Promise<Riddle>;
    incrementSolved(id: string): Promise<void>;
}
//# sourceMappingURL=riddles.service.d.ts.map