import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
  Index,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Riddle } from '../riddles/riddle.entity';
import { DailyRiddle } from '../daily-riddle/daily-riddle.entity';

@Entity('solve_attempts')
@Unique(['userId', 'riddleId'])
@Index(['score'])
@Index(['dailyRiddleId', 'score'])
export class SolveAttempt {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @ManyToOne(() => User, (u) => u.attempts)
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Column({ name: 'riddle_id', type: 'uuid' })
  riddleId!: string;

  @ManyToOne(() => Riddle, (r) => r.attempts)
  @JoinColumn({ name: 'riddle_id' })
  riddle?: Riddle;

  @Column({ name: 'daily_riddle_id', type: 'uuid', nullable: true })
  dailyRiddleId?: string;

  @ManyToOne(() => DailyRiddle)
  @JoinColumn({ name: 'daily_riddle_id' })
  dailyRiddle?: DailyRiddle;

  @Column({ type: 'boolean', default: false })
  solved!: boolean;

  @Column({ name: 'hints_used', type: 'int', default: 0 })
  hintsUsed!: number;

  @Column({ name: 'time_seconds', type: 'int', default: 0 })
  timeSeconds!: number;

  @Column({ type: 'int', default: 0 })
  score!: number;

  @Column({ type: 'int', default: 1 })
  attempts!: number;

  @Column({ name: 'started_at', type: 'datetime' })
  startedAt!: Date;

  @Column({ name: 'completed_at', type: 'datetime', nullable: true })
  completedAt?: Date;
}
