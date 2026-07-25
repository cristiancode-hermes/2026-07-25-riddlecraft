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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const users_service_1 = require("./users.service");
const solve_attempts_service_1 = require("../solve-attempts/solve-attempts.service");
const user_achievements_service_1 = require("../user-achievements/user-achievements.service");
const achievements_service_1 = require("../achievements/achievements.service");
let UsersController = class UsersController {
    usersService;
    solveAttemptsService;
    userAchievementsService;
    achievementsService;
    constructor(usersService, solveAttemptsService, userAchievementsService, achievementsService) {
        this.usersService = usersService;
        this.solveAttemptsService = solveAttemptsService;
        this.userAchievementsService = userAchievementsService;
        this.achievementsService = achievementsService;
    }
    async getProfile(username) {
        const user = await this.usersService.findByUsername(username);
        if (!user) {
            return { error: { statusCode: 404, message: 'User not found' } };
        }
        const totalSolved = await this.solveAttemptsService.countSolvedByUser(user.id);
        const achievements = await this.userAchievementsService.findByUserId(user.id);
        const totalAchievements = await this.achievementsService.count();
        const avgTime = await this.solveAttemptsService.averageTimeByUser(user.id);
        const streak = await this.solveAttemptsService.currentStreak(user.id);
        const maxStreak = await this.solveAttemptsService.maxStreak(user.id);
        return {
            user: {
                id: user.id,
                username: user.username,
                xp: user.xp,
                level: user.level,
                role: user.role,
                createdAt: user.createdAt.toISOString(),
            },
            stats: {
                xp: user.xp,
                level: user.level,
                currentLevelXp: this.usersService.xpForLevel(user.level),
                nextLevelXp: this.usersService.xpForLevel(user.level + 1),
                currentStreak: streak,
                maxStreak: maxStreak,
                totalSolved,
                totalRiddlesCreated: 0,
                achievementsUnlocked: achievements.length,
                achievementsTotal: totalAchievements,
                averageTime: avgTime,
            },
        };
    }
    async getUserSolves(username) {
        const user = await this.usersService.findByUsername(username);
        if (!user) {
            return { error: { statusCode: 404, message: 'User not found' } };
        }
        const solves = await this.solveAttemptsService.findSolvedByUser(user.id);
        return { items: solves.map((s) => ({
                id: s.id,
                riddleId: s.riddleId,
                solved: s.solved,
                score: s.score,
                timeSeconds: s.timeSeconds,
                hintsUsed: s.hintsUsed,
                completedAt: s.completedAt?.toISOString(),
            })) };
    }
    async getUserAchievements(username) {
        const user = await this.usersService.findByUsername(username);
        if (!user) {
            return { error: { statusCode: 404, message: 'User not found' } };
        }
        const unlocks = await this.userAchievementsService.findByUserIdWithAchievement(user.id);
        return { items: unlocks };
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)(':username'),
    __param(0, (0, common_1.Param)('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Get)(':username/solves'),
    __param(0, (0, common_1.Param)('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserSolves", null);
__decorate([
    (0, common_1.Get)(':username/achievements'),
    __param(0, (0, common_1.Param)('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserAchievements", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('Users'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        solve_attempts_service_1.SolveAttemptsService,
        user_achievements_service_1.UserAchievementsService,
        achievements_service_1.AchievementsService])
], UsersController);
//# sourceMappingURL=users.controller.js.map