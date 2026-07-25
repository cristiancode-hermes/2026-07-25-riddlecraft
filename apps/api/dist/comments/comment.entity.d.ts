import { User } from '../users/user.entity';
import { Riddle } from '../riddles/riddle.entity';
export declare class Comment {
    id: string;
    userId: string;
    user?: User;
    riddleId: string;
    riddle?: Riddle;
    text: string;
    createdAt: Date;
    updatedAt?: Date;
}
//# sourceMappingURL=comment.entity.d.ts.map