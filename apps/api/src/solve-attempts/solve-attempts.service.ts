import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SolveAttempt } from './solve-attempt.entity';
import { RiddlesService } from '../riddles/riddles.service';
import { HintsService } from '../hints/hints.service';
import { UsersService } from '../users/users.service';
import { DailyRiddleService } from '../daily-riddle/daily-riddle.service';
import { Hint } from '../hints/hint.entity';

@Injectable()
export class SolveAttemptsService {
  constructor(
    @InjectRepository(SolveAttempt)
    private readonly repo: Repository<SolveAttempt>,
    @InjectRepository(Hint)
    private readonly hintRepo: Repository<Hint>,
    private readonly riddlesService: RiddlesService,
    private readonly hintsService: HintsService,
    private readonly usersService: UsersService,
    private readonly dailyRiddleService: DailyRiddleService,
  ) {}

  async findById(id: string): Promise<SolveAttempt | null> {
    return this.repo.findOne({
      where: { id },
      relations: { riddle: true, user: true },
    });
  }

  async findByUserAndRiddle(userId: string, riddleId: string): Promise<SolveAttempt | null> {
    return this.repo.findOne({
      where: { userId, riddleId },
    });
  }

  async createOrUpdate(userId: string, riddleId: string, dailyRiddleId?: string): Promise<SolveAttempt> {
    let attempt = await this.findByUserAndRiddle(userId, riddleId);
    if (attempt) {
      attempt.attempts += 1;
      return this.repo.save(attempt) as unknown as SolveAttempt;
    }
    const entity = this.repo.create({
      userId,
      riddleId,
      dailyRiddleId: dailyRiddleId ?? undefined,
      startedAt: new Date(),
    });
    return this.repo.save(entity) as unknown as SolveAttempt;
  }

  async submitAnswer(
    attemptId: string,
    answer: string,
  ): Promise<{
    correct: boolean;
    attempt: SolveAttempt;
    score?: number;
    newAchievements?: any[];
    levelUp?: boolean;
  }> {
    const attempt = await this.findById(attemptId);
    if (!attempt) {
      throw new NotFoundException('Attempt not found');
    }
    if (attempt.solved) {
      throw new BadRequestException('Already solved');
    }

    const riddle = await this.riddlesService.findById(attempt.riddleId);
    if (!riddle) {
      throw new NotFoundException('Riddle not found');
    }

    const correct = answer.trim().toLowerCase() === riddle.answer.trim().toLowerCase();

    if (correct) {
      attempt.solved = true;
      attempt.completedAt = new Date();
      attempt.timeSeconds = Math.min(
        attempt.timeSeconds || Math.floor((new Date().getTime() - attempt.startedAt.getTime()) / 1000),
        120,
      );

      const score = this.calculateScore(riddle.difficulty, attempt.timeSeconds, 0, attempt.hintsUsed);
      attempt.score = score;

      await this.riddlesService.incrementSolved(riddle.id);

      const saved = (await this.repo.save(attempt) as unknown as SolveAttempt);

      // Add XP
      const xpReward = score;
      const user = await this.usersService.addXp(attempt.userId, xpReward);

      return {
        correct: true,
        attempt: saved,
        score,
        newAchievements: [],
        levelUp: user.level > (await this.usersService.findById(attempt.userId))?.level! - 1,
      };
    }

    const saved = (await this.repo.save(attempt) as unknown as SolveAttempt);
    return { correct: false, attempt: saved };
  }

  async requestHint(attemptId: string): Promise<{ hint: Hint; penalty: number } | null> {
    const attempt = await this.findById(attemptId);
    if (!attempt) {
      throw new NotFoundException('Attempt not found');
    }

    const hints = await this.hintRepo.find({
      where: { riddleId: attempt.riddleId },
      order: { hintNumber: 'ASC' },
    });

    if (attempt.hintsUsed >= hints.length) {
      return null;
    }

    const nextHint = hints[attempt.hintsUsed];
    attempt.hintsUsed += 1;
    await this.repo.save(attempt as unknown as SolveAttempt);

    const totalPenalty = hints
      .slice(0, attempt.hintsUsed)
      .reduce((sum, h) => sum + h.penaltyPercent, 0);

    return { hint: nextHint, penalty: totalPenalty };
  }

  calculateScore(
    difficulty: string,
    timeSeconds: number,
    streak: number,
    hintsUsed: number,
  ): number {
    const diffMap: Record<string, number> = { easy: 1.0, medium: 1.5, hard: 2.0 };
    const difficultyMultiplier = diffMap[difficulty] || 1.5;

    const cappedTime = Math.min(timeSeconds, 120);
    const baseScore = difficultyMultiplier * (300 - cappedTime * 2);
    const streakBonus = Math.min(streak, 30) * 5;

    const rawScore = baseScore + streakBonus;

    // Hint penalty
    const hints = [10, 20, 30]; // progressive hint penalties
    const totalPenalty = hints.slice(0, hintsUsed).reduce((a, b) => a + b, 0);
    const finalScore = Math.round(rawScore * (1 - totalPenalty / 100));

    return Math.max(finalScore, 0);
  }

  async countSolvedByUser(userId: string): Promise<number> {
    return this.repo.count({ where: { userId, solved: true } });
  }

  async findSolvedByUser(userId: string): Promise<SolveAttempt[]> {
    return this.repo.find({
      where: { userId, solved: true },
      order: { completedAt: 'DESC' },
      take: 50,
    });
  }

  async averageTimeByUser(userId: string): Promise<number> {
    const result = await this.repo
      .createQueryBuilder('sa')
      .select('AVG(sa.timeSeconds)', 'avg')
      .where('sa.userId = :userId', { userId })
      .andWhere('sa.solved = :solved', { solved: true })
      .getRawOne();
    return result?.avg ? Math.round(Number(result.avg)) : 0;
  }

  async currentStreak(userId: string): Promise<number> {
    return this.dailyRiddleService.getCurrentStreak(userId, this.repo);
  }

  async maxStreak(userId: string): Promise<number> {
    const solves = await this.repo.find({
      where: { userId, solved: true },
      order: { completedAt: 'DESC' },
    });
    if (solves.length === 0) return 0;

    const dates = [...new Set(solves.map((s) => {
      if (!s.completedAt) return null;
      const d = new Date(s.completedAt);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }).filter(Boolean))].sort().reverse() as string[];

    if (dates.length === 0) return 0;

    let maxStreak = 1;
    let current = 1;
    for (let i = 1; i < dates.length; i++) {
      const prev = new Date(dates[i - 1]);
      const curr = new Date(dates[i]);
      const diff = (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        current++;
        maxStreak = Math.max(maxStreak, current);
      } else {
        current = 1;
      }
    }
    return maxStreak;
  }

  async getHistory(userId: string, page = 1, limit = 20): Promise<{ items: SolveAttempt[]; total: number; page: number; limit: number; totalPages: number }> {
    const [items, total] = await this.repo.findAndCount({
      where: { userId },
      relations: { riddle: true },
      order: { startedAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getLeaderboardDaily(date: string, limit = 50): Promise<SolveAttempt[]> {
    return this.repo.find({
      where: { solved: true },
      relations: { user: true },
      order: { score: 'DESC' },
      take: limit,
    });
  }

  async getLeaderboardAllTime(limit = 50): Promise<any[]> {
    return this.repo
      .createQueryBuilder('sa')
      .select('sa.userId', 'userId')
      .addSelect('u.username', 'username')
      .addSelect('SUM(sa.score)', 'totalScore')
      .addSelect('COUNT(sa.id)', 'totalSolved')
      .addSelect('AVG(sa.timeSeconds)', 'avgTime')
      .innerJoin('sa.user', 'u')
      .where('sa.solved = :solved', { solved: true })
      .groupBy('sa.userId')
      .addGroupBy('u.username')
      .orderBy('"totalScore"', 'DESC')
      .limit(limit)
      .getRawMany();
  }
}
