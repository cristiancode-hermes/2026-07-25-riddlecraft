import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
export declare class CommentsService {
    private readonly repo;
    constructor(repo: Repository<Comment>);
    findByRiddleId(riddleId: string): Promise<Comment[]>;
    create(data: Partial<Comment>): Promise<Comment>;
    delete(id: string): Promise<void>;
    findById(id: string): Promise<Comment | null>;
}
//# sourceMappingURL=comments.service.d.ts.map