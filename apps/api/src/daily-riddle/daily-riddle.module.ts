import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyRiddle } from './daily-riddle.entity';
import { DailyRiddleService } from './daily-riddle.service';
import { DailyRiddleController } from './daily-riddle.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DailyRiddle])],
  providers: [DailyRiddleService],
  controllers: [DailyRiddleController],
  exports: [DailyRiddleService, TypeOrmModule],
})
export class DailyRiddleModule {}
