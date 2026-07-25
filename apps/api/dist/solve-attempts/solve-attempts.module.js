"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolveAttemptsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const solve_attempt_entity_1 = require("./solve-attempt.entity");
const hint_entity_1 = require("../hints/hint.entity");
const solve_attempts_service_1 = require("./solve-attempts.service");
const solve_attempts_controller_1 = require("./solve-attempts.controller");
const riddles_module_1 = require("../riddles/riddles.module");
const hints_module_1 = require("../hints/hints.module");
const users_module_1 = require("../users/users.module");
const daily_riddle_module_1 = require("../daily-riddle/daily-riddle.module");
let SolveAttemptsModule = class SolveAttemptsModule {
};
exports.SolveAttemptsModule = SolveAttemptsModule;
exports.SolveAttemptsModule = SolveAttemptsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([solve_attempt_entity_1.SolveAttempt, hint_entity_1.Hint]),
            (0, common_1.forwardRef)(() => riddles_module_1.RiddlesModule),
            hints_module_1.HintsModule,
            (0, common_1.forwardRef)(() => users_module_1.UsersModule),
            daily_riddle_module_1.DailyRiddleModule,
        ],
        providers: [solve_attempts_service_1.SolveAttemptsService],
        controllers: [solve_attempts_controller_1.SolveAttemptsController],
        exports: [solve_attempts_service_1.SolveAttemptsService, typeorm_1.TypeOrmModule],
    })
], SolveAttemptsModule);
//# sourceMappingURL=solve-attempts.module.js.map