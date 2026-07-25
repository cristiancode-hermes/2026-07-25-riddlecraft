import { Repository } from 'typeorm';
import { Hint } from './hint.entity';
export declare class HintsService {
    private readonly repo;
    constructor(repo: Repository<Hint>);
    findByRiddleId(riddleId: string): Promise<Hint[]>;
    create(data: Partial<Hint>): Promise<Hint>;
    deleteByRiddleId(riddleId: string): Promise<void>;
}
//# sourceMappingURL=hints.service.d.ts.map