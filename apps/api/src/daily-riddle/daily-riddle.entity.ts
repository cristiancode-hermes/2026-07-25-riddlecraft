import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Riddle } from '../riddles/riddle.entity';

@Entity('daily_riddles')
@Unique(['date'])
export class DailyRiddle {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'riddle_id', type: 'uuid' })
  riddleId!: string;

  @ManyToOne(() => Riddle)
  @JoinColumn({ name: 'riddle_id' })
  riddle?: Riddle;

  @Column({ type: 'date', unique: true })
  date!: string;

  @Column({ name: 'bonus_multiplier', type: 'real', default: 1.0 })
  bonusMultiplier!: number;
}
