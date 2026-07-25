"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DailyRiddleModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const daily_riddle_entity_1 = require("./daily-riddle.entity");
const daily_riddle_service_1 = require("./daily-riddle.service");
const daily_riddle_controller_1 = require("./daily-riddle.controller");
let DailyRiddleModule = class DailyRiddleModule {
};
exports.DailyRiddleModule = DailyRiddleModule;
exports.DailyRiddleModule = DailyRiddleModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([daily_riddle_entity_1.DailyRiddle])],
        providers: [daily_riddle_service_1.DailyRiddleService],
        controllers: [daily_riddle_controller_1.DailyRiddleController],
        exports: [daily_riddle_service_1.DailyRiddleService, typeorm_1.TypeOrmModule],
    })
], DailyRiddleModule);
//# sourceMappingURL=daily-riddle.module.js.map