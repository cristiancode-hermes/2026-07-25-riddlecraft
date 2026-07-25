import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { SolveAttempt } from '../solve-attempts/solve-attempt.entity';
import { UserAchievement } from '../user-achievements/user-achievement.entity';
import { Comment } from '../comments/comment.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 30, unique: true })
  username!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  passwordHash!: string;

  @Column({ type: 'int', default: 0 })
  xp!: number;

  @Column({ type: 'int', default: 1 })
  level!: number;

  @Column({ type: 'varchar', length: 20, default: 'user' })
  role!: string;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt!: Date;

  @OneToMany(() => SolveAttempt, (a) => a.user)
  attempts?: SolveAttempt[];

  @OneToMany(() => UserAchievement, (ua) => ua.user)
  achievements?: UserAchievement[];

  @OneToMany(() => Comment, (c) => c.user)
  comments?: Comment[];
}
