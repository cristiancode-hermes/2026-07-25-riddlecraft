import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Achievement } from '../achievements/achievement.entity';

@Entity('user_achievements')
@Unique(['userId', 'achievementId'])
export class UserAchievement {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @ManyToOne(() => User, (u) => u.achievements)
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Column({ name: 'achievement_id', type: 'uuid' })
  achievementId!: string;

  @ManyToOne(() => Achievement)
  @JoinColumn({ name: 'achievement_id' })
  achievement?: Achievement;

  @CreateDateColumn({ name: 'unlocked_at', type: 'datetime' })
  unlockedAt!: Date;
}
