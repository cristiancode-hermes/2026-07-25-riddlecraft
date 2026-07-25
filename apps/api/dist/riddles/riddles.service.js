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
exports.RiddlesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const riddle_entity_1 = require("./riddle.entity");
const hint_entity_1 = require("../hints/hint.entity");
let RiddlesService = class RiddlesService {
    repo;
    hintRepo;
    constructor(repo, hintRepo) {
        this.repo = repo;
        this.hintRepo = hintRepo;
    }
    async findAll(query) {
        const page = query.page ?? 1;
        const limit = Math.min(query.limit ?? 20, 100);
        const where = { status: 'approved' };
        if (query.category) {
            where.categoryId = query.category;
        }
        if (query.difficulty) {
            where.difficulty = query.difficulty;
        }
        if (query.search) {
            where.title = (0, typeorm_2.Like)(`%${query.search}%`);
        }
        let order = { createdAt: 'DESC' };
        if (query.sort === 'rating') {
            order = { averageRating: 'DESC' };
        }
        else if (query.sort === 'solves') {
            order = { timesSolved: 'DESC' };
        }
        else if (query.sort === 'oldest') {
            order = { createdAt: 'ASC' };
        }
        const [items, total] = await this.repo.findAndCount({
            where,
            order,
            skip: (page - 1) * limit,
            take: limit,
            relations: { category: true, creator: true },
        });
        return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async findById(id, withHints = false) {
        return this.repo.findOne({
            where: { id },
            relations: {
                category: true,
                creator: true,
                hints: withHints,
            },
        });
    }
    async findDailyRiddle() {
        return this.repo.findOne({
            where: { isDaily: true, status: 'approved' },
            relations: { category: true, creator: true, hints: true },
            order: { createdAt: 'DESC' },
        });
    }
    async create(data, hints) {
        const entity = this.repo.create(data);
        const saved = await this.repo.save(entity);
        if (hints && hints.length > 0) {
            const hintEntities = hints.map((h) => this.hintRepo.create({ ...h, riddleId: saved.id }));
            await this.hintRepo.save(hintEntities);
        }
        return this.findById(saved.id, true);
    }
    async update(id, data, hints) {
        const riddle = await this.repo.findOne({ where: { id } });
        if (!riddle) {
            throw new common_1.NotFoundException('Riddle not found');
        }
        await this.repo.update(id, data);
        if (hints) {
            await this.hintRepo.delete({ riddleId: id });
            const hintEntities = hints.map((h) => this.hintRepo.create({ ...h, riddleId: id }));
            await this.hintRepo.save(hintEntities);
        }
        return this.findById(id, true);
    }
    async delete(id) {
        await this.hintRepo.delete({ riddleId: id });
        await this.repo.delete(id);
    }
    async rate(id, rating) {
        const riddle = await this.repo.findOne({ where: { id } });
        if (!riddle) {
            throw new common_1.NotFoundException('Riddle not found');
        }
        const totalScore = riddle.averageRating * riddle.ratingCount + rating;
        riddle.ratingCount += 1;
        riddle.averageRating = totalScore / riddle.ratingCount;
        return this.repo.save(riddle);
    }
    async incrementSolved(id) {
        await this.repo.increment({ id }, 'timesSolved', 1);
    }
};
exports.RiddlesService = RiddlesService;
exports.RiddlesService = RiddlesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(riddle_entity_1.Riddle)),
    __param(1, (0, typeorm_1.InjectRepository)(hint_entity_1.Hint)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], RiddlesService);
//# sourceMappingURL=riddles.service.js.map