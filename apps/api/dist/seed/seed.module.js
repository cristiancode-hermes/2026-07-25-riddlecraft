"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../users/user.entity");
const user_settings_entity_1 = require("../users/user-settings.entity");
const category_entity_1 = require("../categories/category.entity");
const riddle_entity_1 = require("../riddles/riddle.entity");
const hint_entity_1 = require("../hints/hint.entity");
const daily_riddle_entity_1 = require("../daily-riddle/daily-riddle.entity");
const achievement_entity_1 = require("../achievements/achievement.entity");
const seed_service_1 = require("./seed.service");
let SeedModule = class SeedModule {
};
exports.SeedModule = SeedModule;
exports.SeedModule = SeedModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, user_settings_entity_1.UserSettings, category_entity_1.Category, riddle_entity_1.Riddle, hint_entity_1.Hint, daily_riddle_entity_1.DailyRiddle, achievement_entity_1.Achievement]),
        ],
        providers: [seed_service_1.SeedService],
    })
], SeedModule);
//# sourceMappingURL=seed.module.js.map