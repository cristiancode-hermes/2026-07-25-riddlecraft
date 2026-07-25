import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserSettings } from './user-settings.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(UserSettings)
    private readonly settingsRepo: Repository<UserSettings>,
  ) {}

  async findById(id: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { username } });
  }

  async createUser(data: Partial<User>): Promise<User> {
    const user = this.userRepo.create(data);
    const saved = (await this.userRepo.save(user) as unknown as User);
    // Create default settings
    const settings = this.settingsRepo.create({ userId: saved.id });
    await this.settingsRepo.save(settings as unknown as UserSettings);
    return saved;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    await this.userRepo.update(id, data);
    return this.userRepo.findOne({ where: { id } }) as Promise<User>;
  }

  async addXp(id: string, xp: number): Promise<User> {
    const user = await this.findById(id);
    if (!user) throw new Error('User not found');
    user.xp += xp;
    // Check level up
    const newLevel = this.calculateLevel(user.xp);
    user.level = newLevel;
    return this.userRepo.save(user) as unknown as User;
  }

  calculateLevel(xp: number): number {
    let level = 1;
    while (xp >= this.xpForLevel(level + 1)) {
      level++;
    }
    return level;
  }

  xpForLevel(level: number): number {
    return Math.round(500 * Math.pow(level, 1.5));
  }

  async getSettings(userId: string): Promise<UserSettings | null> {
    return this.settingsRepo.findOne({ where: { userId } });
  }

  async updateSettings(userId: string, data: Partial<UserSettings>): Promise<UserSettings> {
    const settings = await this.settingsRepo.findOne({ where: { userId } });
    if (!settings) {
      const created = this.settingsRepo.create({ userId, ...data });
      return this.settingsRepo.save(created) as unknown as UserSettings;
    }
    Object.assign(settings, data);
    return this.settingsRepo.save(settings) as unknown as UserSettings;
  }
}
