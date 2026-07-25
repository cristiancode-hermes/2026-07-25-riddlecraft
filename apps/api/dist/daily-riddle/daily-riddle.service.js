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
exports.DailyRiddleService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const daily_riddle_entity_1 = require("./daily-riddle.entity");
let DailyRiddleService = class DailyRiddleService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async findToday(date) {
        return this.repo.findOne({
            where: { date },
            relations: { riddle: { category: true, creator: true, hints: true } },
        });
    }
    async findAll() {
        return this.repo.find({
            relations: { riddle: true },
            order: { date: 'DESC' },
        });
    }
    async create(data) {
        const entity = this.repo.create(data);
        return this.repo.save(entity);
    }
    async delete(id) {
        await this.repo.delete(id);
    }
    async getCurrentStreak(userId, solveRepo) {
        // Find distinct dates user has solved riddles
        const solves = await solveRepo
            .createQueryBuilder('sa')
            .select('sa.completedAt')
            .where('sa.userId = :userId', { userId })
            .andWhere('sa.solved = :solved', { solved: true })
            .andWhere('sa.completedAt IS NOT NULL')
            .orderBy('sa.completedAt', 'DESC')
            .getMany();
        if (solves.length === 0)
            return 0;
        const dates = solves
            .map((s) => {
            const d = new Date(s.completedAt);
            return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        })
            .filter((v, i, a) => a.indexOf(v) === i)
            .sort()
            .reverse();
        let streak = 1;
        const today = new Date();
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        // Check if the most recent solve is today or yesterday
        const mostRecent = new Date(dates[0]);
        const diffDays = Math.floor((today.getTime() - mostRecent.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays > 1)
            return 0;
        for (let i = 1; i < dates.length; i++) {
            const prev = new Date(dates[i - 1]);
            const curr = new Date(dates[i]);
            const diff = (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24);
            if (diff === 1) {
                streak++;
            }
            else {
                break;
            }
        }
        return streak;
    }
};
exports.DailyRiddleService = DailyRiddleService;
exports.DailyRiddleService = DailyRiddleService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(daily_riddle_entity_1.DailyRiddle)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DailyRiddleService);
//# sourceMappingURL=daily-riddle.service.js.map