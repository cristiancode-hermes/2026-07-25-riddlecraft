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
exports.SolveAttemptsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const solve_attempts_service_1 = require("./solve-attempts.service");
const solve_attempt_dto_1 = require("./dto/solve-attempt.dto");
const riddles_service_1 = require("../riddles/riddles.service");
let SolveAttemptsController = class SolveAttemptsController {
    solveAttemptsService;
    riddlesService;
    constructor(solveAttemptsService, riddlesService) {
        this.solveAttemptsService = solveAttemptsService;
        this.riddlesService = riddlesService;
    }
    async createAttempt(user, riddleId) {
        const attempt = await this.solveAttemptsService.createOrUpdate(user.id, riddleId);
        return { attempt };
    }
    async submitAnswer(id, dto) {
        return this.solveAttemptsService.submitAnswer(id, dto.answer);
    }
    async requestHint(id) {
        const result = await this.solveAttemptsService.requestHint(id);
        if (!result) {
            return { hint: null, message: 'No more hints available' };
        }
        return result;
    }
    async getAttempt(id) {
        const attempt = await this.solveAttemptsService.findById(id);
        if (!attempt) {
            return { error: { statusCode: 404, message: 'Attempt not found' } };
        }
        return { attempt };
    }
    async getHistory(user, page, limit) {
        return this.solveAttemptsService.getHistory(user.id, page ?? 1, limit ?? 20);
    }
};
exports.SolveAttemptsController = SolveAttemptsController;
__decorate([
    (0, common_1.Post)('riddles/:id/attempt'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SolveAttemptsController.prototype, "createAttempt", null);
__decorate([
    (0, common_1.Post)('attempts/:id/submit'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, solve_attempt_dto_1.SubmitAnswerDto]),
    __metadata("design:returntype", Promise)
], SolveAttemptsController.prototype, "submitAnswer", null);
__decorate([
    (0, common_1.Post)('attempts/:id/hint'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SolveAttemptsController.prototype, "requestHint", null);
__decorate([
    (0, common_1.Get)('attempts/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SolveAttemptsController.prototype, "getAttempt", null);
__decorate([
    (0, common_1.Get)('solves/history'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], SolveAttemptsController.prototype, "getHistory", null);
exports.SolveAttemptsController = SolveAttemptsController = __decorate([
    (0, swagger_1.ApiTags)('Solve Attempts'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [solve_attempts_service_1.SolveAttemptsService,
        riddles_service_1.RiddlesService])
], SolveAttemptsController);
//# sourceMappingURL=solve-attempts.controller.js.map