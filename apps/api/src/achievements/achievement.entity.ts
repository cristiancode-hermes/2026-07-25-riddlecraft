import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity('achievements')
export class Achievement {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  key!: string;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ name: 'icon_url', type: 'varchar', length: 255, nullable: true })
  iconUrl?: string;

  @Column({ type: 'simple-json' })
  criteria!: { type: string; threshold: number; categorySlug?: string };

  @Column({ name: 'xp_reward', type: 'int', default: 0 })
  xpReward!: number;
}
