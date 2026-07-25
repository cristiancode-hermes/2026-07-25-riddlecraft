import { Category } from '../categories/category.entity';
import { User } from '../users/user.entity';
import { Hint } from '../hints/hint.entity';
import { SolveAttempt } from '../solve-attempts/solve-attempt.entity';
export declare class Riddle {
    id: string;
    title: string;
    question: string;
    answer: string;
    explanation: string;
    categoryId: string;
    category?: Category;
    difficulty: string;
    creatorId: string;
    creator?: User;
    metadata: Record<string, any>;
    timesSolved: number;
    averageRating: number;
    ratingCount: number;
    isDaily: boolean;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    hints?: Hint[];
    attempts?: SolveAttempt[];
}
//# sourceMappingURL=riddle.entity.d.ts.map