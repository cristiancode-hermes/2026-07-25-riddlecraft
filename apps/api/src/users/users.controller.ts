import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UsersService } from './users.service';
import { SolveAttemptsService } from '../solve-attempts/solve-attempts.service';
import { UserAchievementsService } from '../user-achievements/user-achievements.service';
import { AchievementsService } from '../achievements/achievements.service';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly solveAttemptsService: SolveAttemptsService,
    private readonly userAchievementsService: UserAchievementsService,
    private readonly achievementsService: AchievementsService,
  ) {}

  @Get(':username')
  async getProfile(@Param('username') username: string) {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      return { error: { statusCode: 404, message: 'User not found' } };
    }
    const totalSolved = await this.solveAttemptsService.countSolvedByUser(user.id);
    const achievements = await this.userAchievementsService.findByUserId(user.id);
    const totalAchievements = await this.achievementsService.count();
    const avgTime = await this.solveAttemptsService.averageTimeByUser(user.id);
    const streak = await this.solveAttemptsService.currentStreak(user.id);
    const maxStreak = await this.solveAttemptsService.maxStreak(user.id);

    return {
      user: {
        id: user.id,
        username: user.username,
        xp: user.xp,
        level: user.level,
        role: user.role,
        createdAt: user.createdAt.toISOString(),
      },
      stats: {
        xp: user.xp,
        level: user.level,
        currentLevelXp: this.usersService.xpForLevel(user.level),
        nextLevelXp: this.usersService.xpForLevel(user.level + 1),
        currentStreak: streak,
        maxStreak: maxStreak,
        totalSolved,
        totalRiddlesCreated: 0,
        achievementsUnlocked: achievements.length,
        achievementsTotal: totalAchievements,
        averageTime: avgTime,
      },
    };
  }

  @Get(':username/solves')
  async getUserSolves(@Param('username') username: string) {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      return { error: { statusCode: 404, message: 'User not found' } };
    }
    const solves = await this.solveAttemptsService.findSolvedByUser(user.id);
    return { items: solves.map((s) => ({
      id: s.id,
      riddleId: s.riddleId,
      solved: s.solved,
      score: s.score,
      timeSeconds: s.timeSeconds,
      hintsUsed: s.hintsUsed,
      completedAt: s.completedAt?.toISOString(),
    })) };
  }

  @Get(':username/achievements')
  async getUserAchievements(@Param('username') username: string) {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      return { error: { statusCode: 404, message: 'User not found' } };
    }
    const unlocks = await this.userAchievementsService.findByUserIdWithAchievement(user.id);
    return { items: unlocks };
  }
}
