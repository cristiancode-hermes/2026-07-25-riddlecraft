import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserSettings } from './user-settings.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SettingsController } from './settings.controller';
import { SolveAttemptsModule } from '../solve-attempts/solve-attempts.module';
import { UserAchievementsModule } from '../user-achievements/user-achievements.module';
import { AchievementsModule } from '../achievements/achievements.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserSettings]),
    forwardRef(() => SolveAttemptsModule),
    forwardRef(() => UserAchievementsModule),
    forwardRef(() => AchievementsModule),
  ],
  providers: [UsersService],
  controllers: [UsersController, SettingsController],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
