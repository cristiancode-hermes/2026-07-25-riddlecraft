export declare class CreateHintDto {
    hintNumber: number;
    text: string;
    penaltyPercent: number;
}
export declare class CreateRiddleDto {
    title: string;
    question: string;
    answer: string;
    explanation: string;
    categoryId: string;
    difficulty?: string;
    hints?: CreateHintDto[];
}
export declare class UpdateRiddleDto {
    title?: string;
    question?: string;
    answer?: string;
    explanation?: string;
    categoryId?: string;
    difficulty?: string;
    hints?: CreateHintDto[];
}
export declare class RateRiddleDto {
    rating: number;
    perceivedDifficulty?: string;
}
export declare class QueryRiddlesDto {
    category?: string;
    difficulty?: string;
    search?: string;
    sort?: string;
    page?: number;
    limit?: number;
}
//# sourceMappingURL=riddle.dto.d.ts.map