import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Like } from 'typeorm';
import { Riddle } from './riddle.entity';
import { Hint } from '../hints/hint.entity';

@Injectable()
export class RiddlesService {
  constructor(
    @InjectRepository(Riddle)
    private readonly repo: Repository<Riddle>,
    @InjectRepository(Hint)
    private readonly hintRepo: Repository<Hint>,
  ) {}

  async findAll(query: {
    category?: string;
    difficulty?: string;
    search?: string;
    sort?: string;
    page?: number;
    limit?: number;
  }): Promise<{ items: Riddle[]; total: number; page: number; limit: number; totalPages: number }> {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 20, 100);
    const where: FindOptionsWhere<Riddle> = { status: 'approved' };

    if (query.category) {
      where.categoryId = query.category;
    }
    if (query.difficulty) {
      where.difficulty = query.difficulty;
    }
    if (query.search) {
      where.title = Like(`%${query.search}%`);
    }

    let order: any = { createdAt: 'DESC' };
    if (query.sort === 'rating') {
      order = { averageRating: 'DESC' };
    } else if (query.sort === 'solves') {
      order = { timesSolved: 'DESC' };
    } else if (query.sort === 'oldest') {
      order = { createdAt: 'ASC' };
    }

    const [items, total] = await this.repo.findAndCount({
      where,
      order,
      skip: (page - 1) * limit,
      take: limit,
      relations: { category: true, creator: true },
    });

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id: string, withHints = false): Promise<Riddle | null> {
    return this.repo.findOne({
      where: { id },
      relations: {
        category: true,
        creator: true,
        hints: withHints,
      },
    });
  }

  async findDailyRiddle(): Promise<Riddle | null> {
    return this.repo.findOne({
      where: { isDaily: true, status: 'approved' },
      relations: { category: true, creator: true, hints: true },
      order: { createdAt: 'DESC' },
    });
  }

  async create(data: Partial<Riddle>, hints?: Partial<Hint>[]): Promise<Riddle> {
    const entity = this.repo.create(data);
    const saved = (await this.repo.save(entity) as unknown as Riddle);

    if (hints && hints.length > 0) {
      const hintEntities = hints.map((h) => this.hintRepo.create({ ...h, riddleId: saved.id }));
      await this.hintRepo.save(hintEntities as unknown as Hint[]);
    }

    return this.findById(saved.id, true) as Promise<Riddle>;
  }

  async update(id: string, data: Partial<Riddle>, hints?: Partial<Hint>[]): Promise<Riddle> {
    const riddle = await this.repo.findOne({ where: { id } });
    if (!riddle) {
      throw new NotFoundException('Riddle not found');
    }
    await this.repo.update(id, data);

    if (hints) {
      await this.hintRepo.delete({ riddleId: id });
      const hintEntities = hints.map((h) => this.hintRepo.create({ ...h, riddleId: id }));
      await this.hintRepo.save(hintEntities as unknown as Hint[]);
    }

    return this.findById(id, true) as Promise<Riddle>;
  }

  async delete(id: string): Promise<void> {
    await this.hintRepo.delete({ riddleId: id });
    await this.repo.delete(id);
  }

  async rate(id: string, rating: number): Promise<Riddle> {
    const riddle = await this.repo.findOne({ where: { id } });
    if (!riddle) {
      throw new NotFoundException('Riddle not found');
    }
    const totalScore = riddle.averageRating * riddle.ratingCount + rating;
    riddle.ratingCount += 1;
    riddle.averageRating = totalScore / riddle.ratingCount;
    return this.repo.save(riddle) as unknown as Riddle;
  }

  async incrementSolved(id: string): Promise<void> {
    await this.repo.increment({ id }, 'timesSolved', 1);
  }
}
