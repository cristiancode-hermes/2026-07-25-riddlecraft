import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly repo: Repository<Comment>,
  ) {}

  async findByRiddleId(riddleId: string): Promise<Comment[]> {
    return this.repo.find({
      where: { riddleId },
      relations: { user: true },
      order: { createdAt: 'DESC' },
    });
  }

  async create(data: Partial<Comment>): Promise<Comment> {
    const entity = this.repo.create(data);
    return this.repo.save(entity) as unknown as Comment;
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  async findById(id: string): Promise<Comment | null> {
    return this.repo.findOne({ where: { id }, relations: { user: true } });
  }
}
