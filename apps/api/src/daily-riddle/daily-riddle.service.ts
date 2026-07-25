import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { DailyRiddle } from './daily-riddle.entity';

@Injectable()
export class DailyRiddleService {
  constructor(
    @InjectRepository(DailyRiddle)
    private readonly repo: Repository<DailyRiddle>,
  ) {}

  async findToday(date: string): Promise<DailyRiddle | null> {
    return this.repo.findOne({
      where: { date },
      relations: { riddle: { category: true, creator: true, hints: true } },
    });
  }

  async findAll(): Promise<DailyRiddle[]> {
    return this.repo.find({
      relations: { riddle: true },
      order: { date: 'DESC' },
    });
  }

  async create(data: Partial<DailyRiddle>): Promise<DailyRiddle> {
    const entity = this.repo.create(data);
    return this.repo.save(entity) as unknown as DailyRiddle;
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  async getCurrentStreak(userId: string, solveRepo: any): Promise<number> {
    // Find distinct dates user has solved riddles
    const solves = await solveRepo
      .createQueryBuilder('sa')
      .select('sa.completedAt')
      .where('sa.userId = :userId', { userId })
      .andWhere('sa.solved = :solved', { solved: true })
      .andWhere('sa.completedAt IS NOT NULL')
      .orderBy('sa.completedAt', 'DESC')
      .getMany();

    if (solves.length === 0) return 0;

    const dates = solves
      .map((s: any): string => {
        const d = new Date(s.completedAt);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      })
      .filter((v: string, i: number, a: string[]) => a.indexOf(v) === i)
      .sort()
      .reverse();

    let streak = 1;
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    // Check if the most recent solve is today or yesterday
    const mostRecent = new Date(dates[0]);
    const diffDays = Math.floor((today.getTime() - mostRecent.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays > 1) return 0;

    for (let i = 1; i < dates.length; i++) {
      const prev = new Date(dates[i - 1]);
      const curr = new Date(dates[i]);
      const diff = (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }
}
