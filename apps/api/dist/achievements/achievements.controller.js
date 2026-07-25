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
exports.AchievementsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const achievements_service_1 = require("./achievements.service");
const user_achievements_service_1 = require("../user-achievements/user-achievements.service");
let AchievementsController = class AchievementsController {
    achievementsService;
    userAchievementsService;
    constructor(achievementsService, userAchievementsService) {
        this.achievementsService = achievementsService;
        this.userAchievementsService = userAchievementsService;
    }
    async findAll() {
        const items = await this.achievementsService.findAll();
        return { items };
    }
    async getUserAchievements() {
        return { items: [] };
    }
    async findOne(id) {
        const achievement = await this.achievementsService.findById(id);
        if (!achievement) {
            return { error: { statusCode: 404, message: 'Achievement not found' } };
        }
        return achievement;
    }
};
exports.AchievementsController = AchievementsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AchievementsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('user'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AchievementsController.prototype, "getUserAchievements", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AchievementsController.prototype, "findOne", null);
exports.AchievementsController = AchievementsController = __decorate([
    (0, swagger_1.ApiTags)('Achievements'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('achievements'),
    __metadata("design:paramtypes", [achievements_service_1.AchievementsService,
        user_achievements_service_1.UserAchievementsService])
], AchievementsController);
//# sourceMappingURL=achievements.controller.js.map