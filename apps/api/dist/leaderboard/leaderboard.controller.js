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
exports.LeaderboardController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const solve_attempts_service_1 = require("../solve-attempts/solve-attempts.service");
let LeaderboardController = class LeaderboardController {
    solveAttemptsService;
    constructor(solveAttemptsService) {
        this.solveAttemptsService = solveAttemptsService;
    }
    async dailyLeaderboard(user) {
        const today = new Date().toISOString().split('T')[0];
        const items = await this.solveAttemptsService.getLeaderboardDaily(today);
        const ranked = items.map((item, index) => ({
            rank: index + 1,
            username: item.user?.username ?? 'unknown',
            score: item.score,
            timeSeconds: item.timeSeconds,
            hintsUsed: item.hintsUsed,
        }));
        const userPosition = ranked.find((r) => r.username === user.username);
        return { items: ranked, userPosition };
    }
    async allTimeLeaderboard(user) {
        const items = await this.solveAttemptsService.getLeaderboardAllTime();
        const ranked = items.map((item, index) => ({
            rank: index + 1,
            username: item.username,
            score: parseInt(item.totalScore) || 0,
            totalSolved: parseInt(item.totalSolved) || 0,
            averageTime: Math.round(parseFloat(item.avgTime) || 0),
        }));
        const userPosition = ranked.find((r) => r.username === user.username);
        return { items: ranked, userPosition };
    }
};
exports.LeaderboardController = LeaderboardController;
__decorate([
    (0, common_1.Get)('daily'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LeaderboardController.prototype, "dailyLeaderboard", null);
__decorate([
    (0, common_1.Get)('alltime'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LeaderboardController.prototype, "allTimeLeaderboard", null);
exports.LeaderboardController = LeaderboardController = __decorate([
    (0, swagger_1.ApiTags)('Leaderboard'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('leaderboard'),
    __metadata("design:paramtypes", [solve_attempts_service_1.SolveAttemptsService])
], LeaderboardController);
//# sourceMappingURL=leaderboard.controller.js.map