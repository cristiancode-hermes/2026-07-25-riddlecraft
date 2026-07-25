import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Riddle } from '../riddles/riddle.entity';
import { SolveAttempt } from '../solve-attempts/solve-attempt.entity';
import { DailyRiddle } from '../daily-riddle/daily-riddle.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Riddle)
    private readonly riddleRepo: Repository<Riddle>,
    @InjectRepository(SolveAttempt)
    private readonly solveRepo: Repository<SolveAttempt>,
    @InjectRepository(DailyRiddle)
    private readonly dailyRepo: Repository<DailyRiddle>,
  ) {}

  async getStats() {
    const userCount = await this.userRepo.count();
    const riddleCount = await this.riddleRepo.count();
    const dailySolveCount = await this.dailyRepo.count();
    const pendingRiddles = await this.riddleRepo.count({ where: { status: 'pending' } });

    return {
      userCount,
      riddleCount,
      dailySolveCount,
      reportsCount: pendingRiddles,
    };
  }

  async getReports() {
    const pending = await this.riddleRepo.find({
      where: { status: 'pending' },
      relations: { category: true, creator: true },
      order: { createdAt: 'ASC' },
    });
    return pending;
  }

  async approveRiddle(id: string) {
    return this.riddleRepo.update(id, { status: 'approved' });
  }

  async rejectRiddle(id: string) {
    return this.riddleRepo.update(id, { status: 'rejected' });
  }

  async banUser(id: string) {
    return this.userRepo.update(id, { role: 'banned' });
  }

  async setDailyRiddle(data: { riddleId: string; date: string; bonusMultiplier?: number }) {
    const existing = await this.dailyRepo.findOne({ where: { date: data.date } });
    if (existing) {
      await this.dailyRepo.update(existing.id, {
        riddleId: data.riddleId,
        bonusMultiplier: data.bonusMultiplier ?? 1.0,
      });
      return this.dailyRepo.findOne({ where: { id: existing.id } });
    }
    const entity = this.dailyRepo.create({
      riddleId: data.riddleId,
      date: data.date,
      bonusMultiplier: data.bonusMultiplier ?? 1.0,
    });
    return this.dailyRepo.save(entity) as unknown as DailyRiddle;
  }

  async getDailySchedule() {
    const items = await this.dailyRepo.find({
      relations: { riddle: true },
      order: { date: 'DESC' },
    });
    return items.map((d) => ({
      id: d.id,
      riddleId: d.riddleId,
      riddleTitle: d.riddle?.title ?? 'Unknown',
      date: d.date,
      bonusMultiplier: d.bonusMultiplier,
    }));
  }

  async deleteDaily(id: string) {
    await this.dailyRepo.delete(id);
  }
}
