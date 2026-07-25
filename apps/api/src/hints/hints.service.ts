import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hint } from './hint.entity';

@Injectable()
export class HintsService {
  constructor(
    @InjectRepository(Hint)
    private readonly repo: Repository<Hint>,
  ) {}

  async findByRiddleId(riddleId: string): Promise<Hint[]> {
    return this.repo.find({
      where: { riddleId },
      order: { hintNumber: 'ASC' },
    });
  }

  async create(data: Partial<Hint>): Promise<Hint> {
    const entity = this.repo.create(data);
    return this.repo.save(entity) as unknown as Hint;
  }

  async deleteByRiddleId(riddleId: string): Promise<void> {
    await this.repo.delete({ riddleId });
  }
}
