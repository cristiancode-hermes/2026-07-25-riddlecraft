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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
const riddle_entity_1 = require("../riddles/riddle.entity");
const solve_attempt_entity_1 = require("../solve-attempts/solve-attempt.entity");
const daily_riddle_entity_1 = require("../daily-riddle/daily-riddle.entity");
let AdminService = class AdminService {
    userRepo;
    riddleRepo;
    solveRepo;
    dailyRepo;
    constructor(userRepo, riddleRepo, solveRepo, dailyRepo) {
        this.userRepo = userRepo;
        this.riddleRepo = riddleRepo;
        this.solveRepo = solveRepo;
        this.dailyRepo = dailyRepo;
    }
    async getStats() {
        const userCount = await this.userRepo.count();
        const riddleCount = await this.riddleRepo.count();
        const dailySolveCount = await this.dailyRepo.count();
        const pendingRiddles = await this.riddleRepo.count({ where: { status: 'pending' } });
        return {
            userCount,
            riddleCount,
            dailySolveCount,
            reportsCount: pendingRiddles,
        };
    }
    async getReports() {
        const pending = await this.riddleRepo.find({
            where: { status: 'pending' },
            relations: { category: true, creator: true },
            order: { createdAt: 'ASC' },
        });
        return pending;
    }
    async approveRiddle(id) {
        return this.riddleRepo.update(id, { status: 'approved' });
    }
    async rejectRiddle(id) {
        return this.riddleRepo.update(id, { status: 'rejected' });
    }
    async banUser(id) {
        return this.userRepo.update(id, { role: 'banned' });
    }
    async setDailyRiddle(data) {
        const existing = await this.dailyRepo.findOne({ where: { date: data.date } });
        if (existing) {
            await this.dailyRepo.update(existing.id, {
                riddleId: data.riddleId,
                bonusMultiplier: data.bonusMultiplier ?? 1.0,
            });
            return this.dailyRepo.findOne({ where: { id: existing.id } });
        }
        const entity = this.dailyRepo.create({
            riddleId: data.riddleId,
            date: data.date,
            bonusMultiplier: data.bonusMultiplier ?? 1.0,
        });
        return this.dailyRepo.save(entity);
    }
    async getDailySchedule() {
        const items = await this.dailyRepo.find({
            relations: { riddle: true },
            order: { date: 'DESC' },
        });
        return items.map((d) => ({
            id: d.id,
            riddleId: d.riddleId,
            riddleTitle: d.riddle?.title ?? 'Unknown',
            date: d.date,
            bonusMultiplier: d.bonusMultiplier,
        }));
    }
    async deleteDaily(id) {
        await this.dailyRepo.delete(id);
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(riddle_entity_1.Riddle)),
    __param(2, (0, typeorm_1.InjectRepository)(solve_attempt_entity_1.SolveAttempt)),
    __param(3, (0, typeorm_1.InjectRepository)(daily_riddle_entity_1.DailyRiddle)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AdminService);
//# sourceMappingURL=admin.service.js.map