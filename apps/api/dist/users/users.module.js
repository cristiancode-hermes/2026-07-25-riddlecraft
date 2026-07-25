"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./user.entity");
const user_settings_entity_1 = require("./user-settings.entity");
const users_service_1 = require("./users.service");
const users_controller_1 = require("./users.controller");
const settings_controller_1 = require("./settings.controller");
const solve_attempts_module_1 = require("../solve-attempts/solve-attempts.module");
const user_achievements_module_1 = require("../user-achievements/user-achievements.module");
const achievements_module_1 = require("../achievements/achievements.module");
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, user_settings_entity_1.UserSettings]),
            (0, common_1.forwardRef)(() => solve_attempts_module_1.SolveAttemptsModule),
            (0, common_1.forwardRef)(() => user_achievements_module_1.UserAchievementsModule),
            (0, common_1.forwardRef)(() => achievements_module_1.AchievementsModule),
        ],
        providers: [users_service_1.UsersService],
        controllers: [users_controller_1.UsersController, settings_controller_1.SettingsController],
        exports: [users_service_1.UsersService, typeorm_1.TypeOrmModule],
    })
], UsersModule);
//# sourceMappingURL=users.module.js.map