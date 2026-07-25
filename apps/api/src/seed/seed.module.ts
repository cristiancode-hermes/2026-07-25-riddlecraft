import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { UserSettings } from '../users/user-settings.entity';
import { Category } from '../categories/category.entity';
import { Riddle } from '../riddles/riddle.entity';
import { Hint } from '../hints/hint.entity';
import { DailyRiddle } from '../daily-riddle/daily-riddle.entity';
import { Achievement } from '../achievements/achievement.entity';
import { SeedService } from './seed.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserSettings, Category, Riddle, Hint, DailyRiddle, Achievement]),
  ],
  providers: [SeedService],
})
export class SeedModule {}
