import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Riddle } from '../riddles/riddle.entity';

@Entity('hints')
@Unique(['riddleId', 'hintNumber'])
export class Hint {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'riddle_id', type: 'uuid' })
  riddleId!: string;

  @ManyToOne(() => Riddle, (r) => r.hints)
  @JoinColumn({ name: 'riddle_id' })
  riddle?: Riddle;

  @Column({ name: 'hint_number', type: 'int' })
  hintNumber!: number;

  @Column({ type: 'text' })
  text!: string;

  @Column({ name: 'penalty_percent', type: 'int' })
  penaltyPercent!: number;
}
