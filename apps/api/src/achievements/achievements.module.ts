import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Achievement } from './achievement.entity';
import { AchievementsService } from './achievements.service';
import { AchievementsController } from './achievements.controller';
import { UserAchievementsModule } from '../user-achievements/user-achievements.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Achievement]),
    forwardRef(() => UserAchievementsModule),
  ],
  providers: [AchievementsService],
  controllers: [AchievementsController],
  exports: [AchievementsService, TypeOrmModule],
})
export class AchievementsModule {}
