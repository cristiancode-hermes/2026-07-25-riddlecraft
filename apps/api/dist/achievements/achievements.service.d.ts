import { Repository } from 'typeorm';
import { Achievement } from './achievement.entity';
export declare class AchievementsService {
    private readonly repo;
    constructor(repo: Repository<Achievement>);
    findAll(): Promise<Achievement[]>;
    findById(id: string): Promise<Achievement | null>;
    findByKey(key: string): Promise<Achievement | null>;
    count(): Promise<number>;
    create(data: Partial<Achievement>): Promise<Achievement>;
    bulkCreate(data: Partial<Achievement>[]): Promise<Achievement[]>;
}
//# sourceMappingURL=achievements.service.d.ts.map