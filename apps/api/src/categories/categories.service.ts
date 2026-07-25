import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly repo: Repository<Category>,
  ) {}

  async findAll(): Promise<Category[]> {
    return this.repo.find({ order: { sortOrder: 'ASC' } });
  }

  async findById(id: string): Promise<Category | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findBySlug(slug: string): Promise<Category | null> {
    return this.repo.findOne({ where: { slug } });
  }

  async create(data: Partial<Category>): Promise<Category> {
    const entity = this.repo.create(data);
    return this.repo.save(entity) as unknown as Category;
  }

  async update(id: string, data: Partial<Category>): Promise<Category> {
    await this.repo.update(id, data);
    return this.repo.findOne({ where: { id } }) as Promise<Category>;
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
