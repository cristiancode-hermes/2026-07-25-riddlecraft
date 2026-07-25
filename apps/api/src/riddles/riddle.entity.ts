import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Category } from '../categories/category.entity';
import { User } from '../users/user.entity';
import { Hint } from '../hints/hint.entity';
import { SolveAttempt } from '../solve-attempts/solve-attempt.entity';

@Entity('riddles')
@Index(['categoryId'])
@Index(['creatorId'])
@Index(['status'])
@Index(['createdAt'])
@Index(['averageRating'])
export class Riddle {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 150 })
  title!: string;

  @Column({ type: 'text' })
  question!: string;

  @Column({ type: 'varchar', length: 200 })
  answer!: string;

  @Column({ type: 'text' })
  explanation!: string;

  @Column({ name: 'category_id', type: 'uuid' })
  categoryId!: string;

  @ManyToOne(() => Category, (c) => c.riddles)
  @JoinColumn({ name: 'category_id' })
  category?: Category;

  @Column({ type: 'varchar', length: 10, default: 'medium' })
  difficulty!: string;

  @Column({ name: 'creator_id', type: 'uuid' })
  creatorId!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'creator_id' })
  creator?: User;

  @Column({ type: 'simple-json', default: '{}' })
  metadata!: Record<string, any>;

  @Column({ name: 'times_solved', type: 'int', default: 0 })
  timesSolved!: number;

  @Column({ name: 'average_rating', type: 'real', default: 0 })
  averageRating!: number;

  @Column({ name: 'rating_count', type: 'int', default: 0 })
  ratingCount!: number;

  @Column({ name: 'is_daily', type: 'boolean', default: false })
  isDaily!: boolean;

  @Column({ type: 'varchar', length: 15, default: 'approved' })
  status!: string;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt!: Date;

  @OneToMany(() => Hint, (h) => h.riddle)
  hints?: Hint[];

  @OneToMany(() => SolveAttempt, (sa) => sa.riddle)
  attempts?: SolveAttempt[];
}
