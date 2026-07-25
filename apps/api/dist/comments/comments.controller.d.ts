import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/comment.dto';
export declare class CommentsController {
    private readonly commentsService;
    constructor(commentsService: CommentsService);
    findByRiddle(riddleId: string): Promise<{
        items: {
            id: string;
            userId: string;
            username: string;
            riddleId: string;
            text: string;
            createdAt: string;
            updatedAt: string | undefined;
        }[];
    }>;
    create(user: any, riddleId: string, dto: CreateCommentDto): Promise<{
        id: string;
        userId: string;
        username: any;
        riddleId: string;
        text: string;
        createdAt: string;
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
}
//# sourceMappingURL=comments.controller.d.ts.map