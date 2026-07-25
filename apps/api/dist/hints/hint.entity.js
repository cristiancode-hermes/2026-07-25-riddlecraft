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
exports.Hint = void 0;
const typeorm_1 = require("typeorm");
const riddle_entity_1 = require("../riddles/riddle.entity");
let Hint = class Hint {
    id;
    riddleId;
    riddle;
    hintNumber;
    text;
    penaltyPercent;
};
exports.Hint = Hint;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Hint.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'riddle_id', type: 'uuid' }),
    __metadata("design:type", String)
], Hint.prototype, "riddleId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => riddle_entity_1.Riddle, (r) => r.hints),
    (0, typeorm_1.JoinColumn)({ name: 'riddle_id' }),
    __metadata("design:type", riddle_entity_1.Riddle)
], Hint.prototype, "riddle", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'hint_number', type: 'int' }),
    __metadata("design:type", Number)
], Hint.prototype, "hintNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Hint.prototype, "text", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'penalty_percent', type: 'int' }),
    __metadata("design:type", Number)
], Hint.prototype, "penaltyPercent", void 0);
exports.Hint = Hint = __decorate([
    (0, typeorm_1.Entity)('hints'),
    (0, typeorm_1.Unique)(['riddleId', 'hintNumber'])
], Hint);
//# sourceMappingURL=hint.entity.js.map