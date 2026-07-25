import { Module } from '@nestjs/common';
import { LeaderboardController } from './leaderboard.controller';
import { SolveAttemptsModule } from '../solve-attempts/solve-attempts.module';

@Module({
  imports: [SolveAttemptsModule],
  controllers: [LeaderboardController],
})
export class LeaderboardModule {}
