import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { UserSettings } from '../users/user-settings.entity';
import { Category } from '../categories/category.entity';
import { Riddle } from '../riddles/riddle.entity';
import { Hint } from '../hints/hint.entity';
import { DailyRiddle } from '../daily-riddle/daily-riddle.entity';
import { Achievement } from '../achievements/achievement.entity';
export declare class SeedService implements OnModuleInit {
    private readonly configService;
    private readonly userRepo;
    private readonly settingsRepo;
    private readonly categoryRepo;
    private readonly riddleRepo;
    private readonly hintRepo;
    private readonly dailyRepo;
    private readonly achievementRepo;
    constructor(configService: ConfigService, userRepo: Repository<User>, settingsRepo: Repository<UserSettings>, categoryRepo: Repository<Category>, riddleRepo: Repository<Riddle>, hintRepo: Repository<Hint>, dailyRepo: Repository<DailyRiddle>, achievementRepo: Repository<Achievement>);
    onModuleInit(): Promise<void>;
    seed(): Promise<void>;
    private seedCategories;
    private seedUsers;
    private seedAchievements;
    private seedRiddles;
    private seedDailyRiddle;
}
//# sourceMappingURL=seed.service.d.ts.map