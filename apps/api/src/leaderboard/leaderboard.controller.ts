import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { SolveAttemptsService } from '../solve-attempts/solve-attempts.service';

@ApiTags('Leaderboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('leaderboard')
export class LeaderboardController {
  constructor(
    private readonly solveAttemptsService: SolveAttemptsService,
  ) {}

  @Get('daily')
  async dailyLeaderboard(@CurrentUser() user: any) {
    const today = new Date().toISOString().split('T')[0];
    const items = await this.solveAttemptsService.getLeaderboardDaily(today);
    const ranked = items.map((item, index) => ({
      rank: index + 1,
      username: item.user?.username ?? 'unknown',
      score: item.score,
      timeSeconds: item.timeSeconds,
      hintsUsed: item.hintsUsed,
    }));
    const userPosition = ranked.find((r) => r.username === user.username);
    return { items: ranked, userPosition };
  }

  @Get('alltime')
  async allTimeLeaderboard(@CurrentUser() user: any) {
    const items = await this.solveAttemptsService.getLeaderboardAllTime();
    const ranked = items.map((item: any, index: number) => ({
      rank: index + 1,
      username: item.username,
      score: parseInt(item.totalScore) || 0,
      totalSolved: parseInt(item.totalSolved) || 0,
      averageTime: Math.round(parseFloat(item.avgTime) || 0),
    }));
    const userPosition = ranked.find((r: any) => r.username === user.username);
    return { items: ranked, userPosition };
  }
}
