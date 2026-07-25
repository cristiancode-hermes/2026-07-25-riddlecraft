import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hint } from './hint.entity';
import { HintsService } from './hints.service';

@Module({
  imports: [TypeOrmModule.forFeature([Hint])],
  providers: [HintsService],
  exports: [HintsService, TypeOrmModule],
})
export class HintsModule {}
