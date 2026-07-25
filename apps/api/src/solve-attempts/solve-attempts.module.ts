import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SolveAttempt } from './solve-attempt.entity';
import { Hint } from '../hints/hint.entity';
import { SolveAttemptsService } from './solve-attempts.service';
import { SolveAttemptsController } from './solve-attempts.controller';
import { RiddlesModule } from '../riddles/riddles.module';
import { HintsModule } from '../hints/hints.module';
import { UsersModule } from '../users/users.module';
import { DailyRiddleModule } from '../daily-riddle/daily-riddle.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SolveAttempt, Hint]),
    forwardRef(() => RiddlesModule),
    HintsModule,
    forwardRef(() => UsersModule),
    DailyRiddleModule,
  ],
  providers: [SolveAttemptsService],
  controllers: [SolveAttemptsController],
  exports: [SolveAttemptsService, TypeOrmModule],
})
export class SolveAttemptsModule {}
