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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Riddle = void 0;
const typeorm_1 = require("typeorm");
const category_entity_1 = require("../categories/category.entity");
const user_entity_1 = require("../users/user.entity");
const hint_entity_1 = require("../hints/hint.entity");
const solve_attempt_entity_1 = require("../solve-attempts/solve-attempt.entity");
let Riddle = class Riddle {
    id;
    title;
    question;
    answer;
    explanation;
    categoryId;
    category;
    difficulty;
    creatorId;
    creator;
    metadata;
    timesSolved;
    averageRating;
    ratingCount;
    isDaily;
    status;
    createdAt;
    updatedAt;
    hints;
    attempts;
};
exports.Riddle = Riddle;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Riddle.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 150 }),
    __metadata("design:type", String)
], Riddle.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Riddle.prototype, "question", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200 }),
    __metadata("design:type", String)
], Riddle.prototype, "answer", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Riddle.prototype, "explanation", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'category_id', type: 'uuid' }),
    __metadata("design:type", String)
], Riddle.prototype, "categoryId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => category_entity_1.Category, (c) => c.riddles),
    (0, typeorm_1.JoinColumn)({ name: 'category_id' }),
    __metadata("design:type", category_entity_1.Category)
], Riddle.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10, default: 'medium' }),
    __metadata("design:type", String)
], Riddle.prototype, "difficulty", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'creator_id', type: 'uuid' }),
    __metadata("design:type", String)
], Riddle.prototype, "creatorId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'creator_id' }),
    __metadata("design:type", user_entity_1.User)
], Riddle.prototype, "creator", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-json', default: '{}' }),
    __metadata("design:type", Object)
], Riddle.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'times_solved', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Riddle.prototype, "timesSolved", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'average_rating', type: 'real', default: 0 }),
    __metadata("design:type", Number)
], Riddle.prototype, "averageRating", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'rating_count', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Riddle.prototype, "ratingCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_daily', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Riddle.prototype, "isDaily", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 15, default: 'approved' }),
    __metadata("design:type", String)
], Riddle.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'datetime' }),
    __metadata("design:type", Date)
], Riddle.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'datetime' }),
    __metadata("design:type", Date)
], Riddle.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => hint_entity_1.Hint, (h) => h.riddle),
    __metadata("design:type", Array)
], Riddle.prototype, "hints", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => solve_attempt_entity_1.SolveAttempt, (sa) => sa.riddle),
    __metadata("design:type", Array)
], Riddle.prototype, "attempts", void 0);
exports.Riddle = Riddle = __decorate([
    (0, typeorm_1.Entity)('riddles'),
    (0, typeorm_1.Index)(['categoryId']),
    (0, typeorm_1.Index)(['creatorId']),
    (0, typeorm_1.Index)(['status']),
    (0, typeorm_1.Index)(['createdAt']),
    (0, typeorm_1.Index)(['averageRating'])
], Riddle);
//# sourceMappingURL=riddle.entity.js.map