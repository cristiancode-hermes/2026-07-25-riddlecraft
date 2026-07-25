import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Riddle } from '../riddles/riddle.entity';
import { SolveAttempt } from '../solve-attempts/solve-attempt.entity';
import { DailyRiddle } from '../daily-riddle/daily-riddle.entity';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Riddle, SolveAttempt, DailyRiddle]),
  ],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
