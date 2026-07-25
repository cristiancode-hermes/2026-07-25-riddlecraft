import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAchievement } from './user-achievement.entity';
import { UserAchievementsService } from './user-achievements.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserAchievement])],
  providers: [UserAchievementsService],
  exports: [UserAchievementsService, TypeOrmModule],
})
export class UserAchievementsModule {}
