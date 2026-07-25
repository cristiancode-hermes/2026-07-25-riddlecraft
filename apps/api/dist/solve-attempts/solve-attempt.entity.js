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
exports.SolveAttempt = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
const riddle_entity_1 = require("../riddles/riddle.entity");
const daily_riddle_entity_1 = require("../daily-riddle/daily-riddle.entity");
let SolveAttempt = class SolveAttempt {
    id;
    userId;
    user;
    riddleId;
    riddle;
    dailyRiddleId;
    dailyRiddle;
    solved;
    hintsUsed;
    timeSeconds;
    score;
    attempts;
    startedAt;
    completedAt;
};
exports.SolveAttempt = SolveAttempt;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SolveAttempt.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', type: 'uuid' }),
    __metadata("design:type", String)
], SolveAttempt.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (u) => u.attempts),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], SolveAttempt.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'riddle_id', type: 'uuid' }),
    __metadata("design:type", String)
], SolveAttempt.prototype, "riddleId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => riddle_entity_1.Riddle, (r) => r.attempts),
    (0, typeorm_1.JoinColumn)({ name: 'riddle_id' }),
    __metadata("design:type", riddle_entity_1.Riddle)
], SolveAttempt.prototype, "riddle", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'daily_riddle_id', type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], SolveAttempt.prototype, "dailyRiddleId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => daily_riddle_entity_1.DailyRiddle),
    (0, typeorm_1.JoinColumn)({ name: 'daily_riddle_id' }),
    __metadata("design:type", daily_riddle_entity_1.DailyRiddle)
], SolveAttempt.prototype, "dailyRiddle", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], SolveAttempt.prototype, "solved", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'hints_used', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], SolveAttempt.prototype, "hintsUsed", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'time_seconds', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], SolveAttempt.prototype, "timeSeconds", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], SolveAttempt.prototype, "score", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 1 }),
    __metadata("design:type", Number)
], SolveAttempt.prototype, "attempts", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'started_at', type: 'datetime' }),
    __metadata("design:type", Date)
], SolveAttempt.prototype, "startedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'completed_at', type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], SolveAttempt.prototype, "completedAt", void 0);
exports.SolveAttempt = SolveAttempt = __decorate([
    (0, typeorm_1.Entity)('solve_attempts'),
    (0, typeorm_1.Unique)(['userId', 'riddleId']),
    (0, typeorm_1.Index)(['score']),
    (0, typeorm_1.Index)(['dailyRiddleId', 'score'])
], SolveAttempt);
//# sourceMappingURL=solve-attempt.entity.js.map