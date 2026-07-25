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
exports.DailyRiddle = void 0;
const typeorm_1 = require("typeorm");
const riddle_entity_1 = require("../riddles/riddle.entity");
let DailyRiddle = class DailyRiddle {
    id;
    riddleId;
    riddle;
    date;
    bonusMultiplier;
};
exports.DailyRiddle = DailyRiddle;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], DailyRiddle.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'riddle_id', type: 'uuid' }),
    __metadata("design:type", String)
], DailyRiddle.prototype, "riddleId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => riddle_entity_1.Riddle),
    (0, typeorm_1.JoinColumn)({ name: 'riddle_id' }),
    __metadata("design:type", riddle_entity_1.Riddle)
], DailyRiddle.prototype, "riddle", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', unique: true }),
    __metadata("design:type", String)
], DailyRiddle.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'bonus_multiplier', type: 'real', default: 1.0 }),
    __metadata("design:type", Number)
], DailyRiddle.prototype, "bonusMultiplier", void 0);
exports.DailyRiddle = DailyRiddle = __decorate([
    (0, typeorm_1.Entity)('daily_riddles'),
    (0, typeorm_1.Unique)(['date'])
], DailyRiddle);
//# sourceMappingURL=daily-riddle.entity.js.map