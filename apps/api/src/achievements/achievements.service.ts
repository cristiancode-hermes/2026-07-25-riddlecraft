import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Achievement } from './achievement.entity';

@Injectable()
export class AchievementsService {
  constructor(
    @InjectRepository(Achievement)
    private readonly repo: Repository<Achievement>,
  ) {}

  async findAll(): Promise<Achievement[]> {
    return this.repo.find();
  }

  async findById(id: string): Promise<Achievement | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByKey(key: string): Promise<Achievement | null> {
    return this.repo.findOne({ where: { key } });
  }

  async count(): Promise<number> {
    return this.repo.count();
  }

  async create(data: Partial<Achievement>): Promise<Achievement> {
    const entity = this.repo.create(data);
    return this.repo.save(entity) as unknown as Achievement;
  }

  async bulkCreate(data: Partial<Achievement>[]): Promise<Achievement[]> {
    const entities = this.repo.create(data);
    return this.repo.save(entities) as unknown as Achievement[];
  }
}
