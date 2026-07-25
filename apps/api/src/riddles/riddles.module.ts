import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Riddle } from './riddle.entity';
import { Hint } from '../hints/hint.entity';
import { RiddlesService } from './riddles.service';
import { RiddlesController } from './riddles.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Riddle, Hint]),
  ],
  providers: [RiddlesService],
  controllers: [RiddlesController],
  exports: [RiddlesService, TypeOrmModule],
})
export class RiddlesModule {}
