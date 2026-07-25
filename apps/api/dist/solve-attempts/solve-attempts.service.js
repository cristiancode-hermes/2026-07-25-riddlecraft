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
exports.SolveAttemptsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const solve_attempt_entity_1 = require("./solve-attempt.entity");
const riddles_service_1 = require("../riddles/riddles.service");
const hints_service_1 = require("../hints/hints.service");
const users_service_1 = require("../users/users.service");
const daily_riddle_service_1 = require("../daily-riddle/daily-riddle.service");
const hint_entity_1 = require("../hints/hint.entity");
let SolveAttemptsService = class SolveAttemptsService {
    repo;
    hintRepo;
    riddlesService;
    hintsService;
    usersService;
    dailyRiddleService;
    constructor(repo, hintRepo, riddlesService, hintsService, usersService, dailyRiddleService) {
        this.repo = repo;
        this.hintRepo = hintRepo;
        this.riddlesService = riddlesService;
        this.hintsService = hintsService;
        this.usersService = usersService;
        this.dailyRiddleService = dailyRiddleService;
    }
    async findById(id) {
        return this.repo.findOne({
            where: { id },
            relations: { riddle: true, user: true },
        });
    }
    async findByUserAndRiddle(userId, riddleId) {
        return this.repo.findOne({
            where: { userId, riddleId },
        });
    }
    async createOrUpdate(userId, riddleId, dailyRiddleId) {
        let attempt = await this.findByUserAndRiddle(userId, riddleId);
        if (attempt) {
            attempt.attempts += 1;
            return this.repo.save(attempt);
        }
        const entity = this.repo.create({
            userId,
            riddleId,
            dailyRiddleId: dailyRiddleId ?? undefined,
            startedAt: new Date(),
        });
        return this.repo.save(entity);
    }
    async submitAnswer(attemptId, answer) {
        const attempt = await this.findById(attemptId);
        if (!attempt) {
            throw new common_1.NotFoundException('Attempt not found');
        }
        if (attempt.solved) {
            throw new common_1.BadRequestException('Already solved');
        }
        const riddle = await this.riddlesService.findById(attempt.riddleId);
        if (!riddle) {
            throw new common_1.NotFoundException('Riddle not found');
        }
        const correct = answer.trim().toLowerCase() === riddle.answer.trim().toLowerCase();
        if (correct) {
            attempt.solved = true;
            attempt.completedAt = new Date();
            attempt.timeSeconds = Math.min(attempt.timeSeconds || Math.floor((new Date().getTime() - attempt.startedAt.getTime()) / 1000), 120);
            const score = this.calculateScore(riddle.difficulty, attempt.timeSeconds, 0, attempt.hintsUsed);
            attempt.score = score;
            await this.riddlesService.incrementSolved(riddle.id);
            const saved = await this.repo.save(attempt);
            // Add XP
            const xpReward = score;
            const user = await this.usersService.addXp(attempt.userId, xpReward);
            return {
                correct: true,
                attempt: saved,
                score,
                newAchievements: [],
                levelUp: user.level > (await this.usersService.findById(attempt.userId))?.level - 1,
            };
        }
        const saved = await this.repo.save(attempt);
        return { correct: false, attempt: saved };
    }
    async requestHint(attemptId) {
        const attempt = await this.findById(attemptId);
        if (!attempt) {
            throw new common_1.NotFoundException('Attempt not found');
        }
        const hints = await this.hintRepo.find({
            where: { riddleId: attempt.riddleId },
            order: { hintNumber: 'ASC' },
        });
        if (attempt.hintsUsed >= hints.length) {
            return null;
        }
        const nextHint = hints[attempt.hintsUsed];
        attempt.hintsUsed += 1;
        await this.repo.save(attempt);
        const totalPenalty = hints
            .slice(0, attempt.hintsUsed)
            .reduce((sum, h) => sum + h.penaltyPercent, 0);
        return { hint: nextHint, penalty: totalPenalty };
    }
    calculateScore(difficulty, timeSeconds, streak, hintsUsed) {
        const diffMap = { easy: 1.0, medium: 1.5, hard: 2.0 };
        const difficultyMultiplier = diffMap[difficulty] || 1.5;
        const cappedTime = Math.min(timeSeconds, 120);
        const baseScore = difficultyMultiplier * (300 - cappedTime * 2);
        const streakBonus = Math.min(streak, 30) * 5;
        const rawScore = baseScore + streakBonus;
        // Hint penalty
        const hints = [10, 20, 30]; // progressive hint penalties
        const totalPenalty = hints.slice(0, hintsUsed).reduce((a, b) => a + b, 0);
        const finalScore = Math.round(rawScore * (1 - totalPenalty / 100));
        return Math.max(finalScore, 0);
    }
    async countSolvedByUser(userId) {
        return this.repo.count({ where: { userId, solved: true } });
    }
    async findSolvedByUser(userId) {
        return this.repo.find({
            where: { userId, solved: true },
            order: { completedAt: 'DESC' },
            take: 50,
        });
    }
    async averageTimeByUser(userId) {
        const result = await this.repo
            .createQueryBuilder('sa')
            .select('AVG(sa.timeSeconds)', 'avg')
            .where('sa.userId = :userId', { userId })
            .andWhere('sa.solved = :solved', { solved: true })
            .getRawOne();
        return result?.avg ? Math.round(Number(result.avg)) : 0;
    }
    async currentStreak(userId) {
        return this.dailyRiddleService.getCurrentStreak(userId, this.repo);
    }
    async maxStreak(userId) {
        const solves = await this.repo.find({
            where: { userId, solved: true },
            order: { completedAt: 'DESC' },
        });
        if (solves.length === 0)
            return 0;
        const dates = [...new Set(solves.map((s) => {
                if (!s.completedAt)
                    return null;
                const d = new Date(s.completedAt);
                return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            }).filter(Boolean))].sort().reverse();
        if (dates.length === 0)
            return 0;
        let maxStreak = 1;
        let current = 1;
        for (let i = 1; i < dates.length; i++) {
            const prev = new Date(dates[i - 1]);
            const curr = new Date(dates[i]);
            const diff = (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24);
            if (diff === 1) {
                current++;
                maxStreak = Math.max(maxStreak, current);
            }
            else {
                current = 1;
            }
        }
        return maxStreak;
    }
    async getHistory(userId, page = 1, limit = 20) {
        const [items, total] = await this.repo.findAndCount({
            where: { userId },
            relations: { riddle: true },
            order: { startedAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async getLeaderboardDaily(date, limit = 50) {
        return this.repo.find({
            where: { solved: true },
            relations: { user: true },
            order: { score: 'DESC' },
            take: limit,
        });
    }
    async getLeaderboardAllTime(limit = 50) {
        return this.repo
            .createQueryBuilder('sa')
            .select('sa.userId', 'userId')
            .addSelect('u.username', 'username')
            .addSelect('SUM(sa.score)', 'totalScore')
            .addSelect('COUNT(sa.id)', 'totalSolved')
            .addSelect('AVG(sa.timeSeconds)', 'avgTime')
            .innerJoin('sa.user', 'u')
            .where('sa.solved = :solved', { solved: true })
            .groupBy('sa.userId')
            .addGroupBy('u.username')
            .orderBy('"totalScore"', 'DESC')
            .limit(limit)
            .getRawMany();
    }
};
exports.SolveAttemptsService = SolveAttemptsService;
exports.SolveAttemptsService = SolveAttemptsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(solve_attempt_entity_1.SolveAttempt)),
    __param(1, (0, typeorm_1.InjectRepository)(hint_entity_1.Hint)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        riddles_service_1.RiddlesService,
        hints_service_1.HintsService,
        users_service_1.UsersService,
        daily_riddle_service_1.DailyRiddleService])
], SolveAttemptsService);
//# sourceMappingURL=solve-attempts.service.js.map