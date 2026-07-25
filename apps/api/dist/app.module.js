"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const entities_1 = require("./entities");
const users_module_1 = require("./users/users.module");
const auth_module_1 = require("./auth/auth.module");
const categories_module_1 = require("./categories/categories.module");
const riddles_module_1 = require("./riddles/riddles.module");
const daily_riddle_module_1 = require("./daily-riddle/daily-riddle.module");
const solve_attempts_module_1 = require("./solve-attempts/solve-attempts.module");
const achievements_module_1 = require("./achievements/achievements.module");
const comments_module_1 = require("./comments/comments.module");
const leaderboard_module_1 = require("./leaderboard/leaderboard.module");
const admin_module_1 = require("./admin/admin.module");
const seed_module_1 = require("./seed/seed.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    type: 'better-sqlite3',
                    database: config.get('DATABASE_PATH', './data/riddlecraft.db'),
                    entities: entities_1.entities,
                    synchronize: true,
                    autoLoadEntities: false,
                }),
            }),
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            categories_module_1.CategoriesModule,
            riddles_module_1.RiddlesModule,
            daily_riddle_module_1.DailyRiddleModule,
            solve_attempts_module_1.SolveAttemptsModule,
            achievements_module_1.AchievementsModule,
            comments_module_1.CommentsModule,
            leaderboard_module_1.LeaderboardModule,
            admin_module_1.AdminModule,
            seed_module_1.SeedModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map