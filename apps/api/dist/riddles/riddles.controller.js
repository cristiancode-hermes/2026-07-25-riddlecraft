"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiddlesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const riddles_service_1 = require("./riddles.service");
const riddle_dto_1 = require("./dto/riddle.dto");
let RiddlesController = class RiddlesController {
    riddlesService;
    constructor(riddlesService) {
        this.riddlesService = riddlesService;
    }
    async getDailyRiddle(user) {
        const riddle = await this.riddlesService.findDailyRiddle();
        if (!riddle) {
            return { riddle: null, solved: false };
        }
        return {
            riddle,
            solved: false,
            attempt: null,
        };
    }
    async findAll(query) {
        return this.riddlesService.findAll(query);
    }
    async findOne(id) {
        const riddle = await this.riddlesService.findById(id, true);
        if (!riddle) {
            return { error: { statusCode: 404, message: 'Riddle not found' } };
        }
        return { riddle };
    }
    async create(user, dto) {
        const riddle = await this.riddlesService.create({
            title: dto.title,
            question: dto.question,
            answer: dto.answer,
            explanation: dto.explanation,
            categoryId: dto.categoryId,
            difficulty: dto.difficulty ?? 'medium',
            creatorId: user.id,
            status: 'pending',
        }, dto.hints);
        return { riddle };
    }
    async update(user, id, dto) {
        const existing = await this.riddlesService.findById(id);
        if (!existing) {
            return { error: { statusCode: 404, message: 'Riddle not found' } };
        }
        if (existing.creatorId !== user.id && user.role !== 'admin') {
            return { error: { statusCode: 403, message: 'Not authorized' } };
        }
        const updateData = {};
        if (dto.title !== undefined)
            updateData.title = dto.title;
        if (dto.question !== undefined)
            updateData.question = dto.question;
        if (dto.answer !== undefined)
            updateData.answer = dto.answer;
        if (dto.explanation !== undefined)
            updateData.explanation = dto.explanation;
        if (dto.categoryId !== undefined)
            updateData.categoryId = dto.categoryId;
        if (dto.difficulty !== undefined)
            updateData.difficulty = dto.difficulty;
        const riddle = await this.riddlesService.update(id, updateData, dto.hints);
        return { riddle };
    }
    async delete(user, id) {
        const existing = await this.riddlesService.findById(id);
        if (!existing) {
            return { error: { statusCode: 404, message: 'Riddle not found' } };
        }
        if (existing.creatorId !== user.id && user.role !== 'admin') {
            return { error: { statusCode: 403, message: 'Not authorized' } };
        }
        await this.riddlesService.delete(id);
        return { success: true };
    }
    async rate(id, dto) {
        const riddle = await this.riddlesService.rate(id, dto.rating);
        return { riddle };
    }
};
exports.RiddlesController = RiddlesController;
__decorate([
    (0, common_1.Get)('daily'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RiddlesController.prototype, "getDailyRiddle", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [riddle_dto_1.QueryRiddlesDto]),
    __metadata("design:returntype", Promise)
], RiddlesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RiddlesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, riddle_dto_1.CreateRiddleDto]),
    __metadata("design:returntype", Promise)
], RiddlesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, riddle_dto_1.UpdateRiddleDto]),
    __metadata("design:returntype", Promise)
], RiddlesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], RiddlesController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)(':id/rate'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, riddle_dto_1.RateRiddleDto]),
    __metadata("design:returntype", Promise)
], RiddlesController.prototype, "rate", null);
exports.RiddlesController = RiddlesController = __decorate([
    (0, swagger_1.ApiTags)('Riddles'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('riddles'),
    __metadata("design:paramtypes", [riddles_service_1.RiddlesService])
], RiddlesController);
//# sourceMappingURL=riddles.controller.js.map