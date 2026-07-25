import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    findAll(): Promise<{
        items: import("./category.entity").Category[];
    }>;
    findOne(id: string): Promise<import("./category.entity").Category | {
        error: {
            statusCode: number;
            message: string;
        };
    }>;
    create(dto: CreateCategoryDto): Promise<import("./category.entity").Category>;
    update(id: string, dto: UpdateCategoryDto): Promise<import("./category.entity").Category>;
    delete(id: string): Promise<{
        success: boolean;
    }>;
}
//# sourceMappingURL=categories.controller.d.ts.map