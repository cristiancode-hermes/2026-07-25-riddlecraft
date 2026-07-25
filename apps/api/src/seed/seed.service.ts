import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/user.entity';
import { UserSettings } from '../users/user-settings.entity';
import { Category } from '../categories/category.entity';
import { Riddle } from '../riddles/riddle.entity';
import { Hint } from '../hints/hint.entity';
import { DailyRiddle } from '../daily-riddle/daily-riddle.entity';
import { Achievement } from '../achievements/achievement.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(UserSettings)
    private readonly settingsRepo: Repository<UserSettings>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    @InjectRepository(Riddle)
    private readonly riddleRepo: Repository<Riddle>,
    @InjectRepository(Hint)
    private readonly hintRepo: Repository<Hint>,
    @InjectRepository(DailyRiddle)
    private readonly dailyRepo: Repository<DailyRiddle>,
    @InjectRepository(Achievement)
    private readonly achievementRepo: Repository<Achievement>,
  ) {}

  async onModuleInit() {
    const shouldSeed = this.configService.get<string>('SEED_DB');
    if (shouldSeed !== 'true') {
      return;
    }
    console.log('🌱 Seeding database...');
    await this.seed();
    console.log('✅ Seeding complete');
  }

  async seed() {
    await this.seedCategories();
    await this.seedUsers();
    await this.seedAchievements();
    await this.seedRiddles();
    await this.seedDailyRiddle();
  }

  private async seedCategories() {
    const count = await this.categoryRepo.count();
    if (count > 0) return;

    const categories = [
      { name: 'Wordplay', slug: 'wordplay', description: 'Puns, anagrams, and word puzzles', icon: '🧠', sortOrder: 1 },
      { name: 'Logic', slug: 'logic', description: 'Logic puzzles and deduction challenges', icon: '🔢', sortOrder: 2 },
      { name: 'Math', slug: 'math', description: 'Mathematical puzzles and number problems', icon: '📐', sortOrder: 3 },
      { name: 'Lateral Thinking', slug: 'lateral-thinking', description: 'Think outside the box puzzles', icon: '🤔', sortOrder: 4 },
      { name: 'Visual', slug: 'visual', description: 'Visual and pattern-based puzzles', icon: '👁️', sortOrder: 5 },
    ];
    await this.categoryRepo.save(this.categoryRepo.create(categories));
    console.log('  Categories seeded');
  }

  private async seedUsers() {
    const adminExists = await this.userRepo.findOne({ where: { email: 'admin@riddlecraft.dev' } });
    if (!adminExists) {
      const adminHash = await bcrypt.hash('admin123', 10);
      const admin = this.userRepo.create({
        username: 'admin',
        email: 'admin@riddlecraft.dev',
        passwordHash: adminHash,
        role: 'admin',
        xp: 1000,
        level: 5,
      });
      const savedAdmin = (await this.userRepo.save(admin) as unknown as User);
      const adminSettings = this.settingsRepo.create({ userId: savedAdmin.id });
      await this.settingsRepo.save(adminSettings as unknown as UserSettings);
      console.log('  Admin user seeded');
    }

    const demoExists = await this.userRepo.findOne({ where: { email: 'demo@riddlecraft.dev' } });
    if (!demoExists) {
      const demoHash = await bcrypt.hash('demo1234', 10);
      const demo = this.userRepo.create({
        username: 'demo',
        email: 'demo@riddlecraft.dev',
        passwordHash: demoHash,
        role: 'user',
        xp: 500,
        level: 3,
      });
      const savedDemo = (await this.userRepo.save(demo) as unknown as User);
      const demoSettings = this.settingsRepo.create({ userId: savedDemo.id });
      await this.settingsRepo.save(demoSettings as unknown as UserSettings);
      console.log('  Demo user seeded');
    }
  }

  private async seedAchievements() {
    const count = await this.achievementRepo.count();
    if (count > 0) return;

    const achievements = [
      { key: 'first_solve', name: 'First Steps', description: 'Solve your first riddle', criteria: { type: 'solved_count', threshold: 1 }, xpReward: 50 },
      { key: 'streak_7', name: 'Week Warrior', description: 'Solve a riddle 7 days in a row', criteria: { type: 'streak_days', threshold: 7 }, xpReward: 200 },
      { key: 'streak_30', name: 'Monthly Master', description: 'Solve a riddle 30 days in a row', criteria: { type: 'streak_days', threshold: 30 }, xpReward: 500 },
      { key: 'streak_100', name: 'Century Club', description: 'Solve a riddle 100 days in a row', criteria: { type: 'streak_days', threshold: 100 }, xpReward: 2000 },
      { key: 'speedster', name: 'Speedster', description: 'Solve a riddle in under 10 seconds', criteria: { type: 'fast_solve', threshold: 10 }, xpReward: 300 },
      { key: 'wordplay_master', name: 'Wordplay Wizard', description: 'Solve 10 Wordplay riddles', criteria: { type: 'category_count', threshold: 10, categorySlug: 'wordplay' }, xpReward: 300 },
      { key: 'logic_genius', name: 'Logic Legend', description: 'Solve 10 Logic riddles', criteria: { type: 'category_count', threshold: 10, categorySlug: 'logic' }, xpReward: 300 },
      { key: 'lateral_thinker', name: 'Lateral Thinker', description: 'Solve 10 Lateral Thinking riddles', criteria: { type: 'category_count', threshold: 10, categorySlug: 'lateral-thinking' }, xpReward: 300 },
      { key: 'encyclopedia', name: 'Encyclopedia', description: 'Solve 100 riddles total', criteria: { type: 'solved_count', threshold: 100 }, xpReward: 1000 },
      { key: 'legend', name: 'Legend', description: 'Solve 500 riddles total', criteria: { type: 'solved_count', threshold: 500 }, xpReward: 5000 },
      { key: 'creator', name: 'Riddle Crafter', description: 'Create your first riddle', criteria: { type: 'created_count', threshold: 1 }, xpReward: 100 },
      { key: 'no_hints', name: 'Pure Genius', description: 'Solve a riddle without using any hints', criteria: { type: 'no_hints', threshold: 1 }, xpReward: 150 },
    ];
    await this.achievementRepo.save(this.achievementRepo.create(achievements));
    console.log('  Achievements seeded');
  }

  private async seedRiddles() {
    const count = await this.riddleRepo.count();
    if (count > 0) return;

    const admin = await this.userRepo.findOne({ where: { email: 'admin@riddlecraft.dev' } });
    const adminId = admin?.id;

    const categories = await this.categoryRepo.find();
    const catMap = new Map(categories.map((c) => [c.slug, c.id]));

    if (!adminId) return;

    const riddles = [
      {
        title: 'The Talking Parrot',
        question: 'A man walks into a pet shop and sees a parrot that can talk. The parrot says, "I can speak 5 languages." The man is impressed and buys the parrot. When he gets home, the parrot speaks 3 languages fluently but struggles with the other 2. What happened?',
        answer: 'the parrot was lying',
        explanation: 'Parrots can mimic human speech, but they don\'t actually "know" languages. The parrot was just repeating what it heard.',
        categorySlug: 'lateral-thinking',
        difficulty: 'easy',
        hints: [
          { hintNumber: 1, text: 'Think about what a parrot is actually capable of.', penaltyPercent: 10 },
          { hintNumber: 2, text: 'Consider the difference between mimicry and understanding.', penaltyPercent: 20 },
        ],
      },
      {
        title: 'The River Crossing',
        question: 'A farmer needs to cross a river with a wolf, a goat, and a cabbage. His boat can only carry him and one item at a time. If left alone, the wolf will eat the goat, and the goat will eat the cabbage. How can he get all three across safely?',
        answer: 'take goat, return, take wolf, bring goat back, take cabbage, return, take goat',
        explanation: 'The classic river crossing puzzle requires careful planning to avoid leaving incompatible items together.',
        categorySlug: 'logic',
        difficulty: 'medium',
        hints: [
          { hintNumber: 1, text: 'The goat is the problematic item - it conflicts with both the wolf and the cabbage.', penaltyPercent: 10 },
          { hintNumber: 2, text: 'You\'ll need to bring the goat back at one point.', penaltyPercent: 20 },
        ],
      },
      {
        title: 'The Birthday Puzzle',
        question: 'If there are 23 people in a room, what is the approximate probability that at least two share the same birthday? (No tricks - assume 365 days and equal distribution)',
        answer: '50%',
        explanation: 'This is the famous Birthday Paradox. With 23 people, the probability of a shared birthday is about 50.7%.',
        categorySlug: 'math',
        difficulty: 'medium',
        hints: [
          { hintNumber: 1, text: 'It\'s easier to calculate the probability that NO two people share a birthday.', penaltyPercent: 10 },
        ],
      },
      {
        title: 'What Has Keys But Cannot Open Locks?',
        question: 'What has keys but cannot open locks? It has a space but cannot hold anything. You can enter but cannot go inside.',
        answer: 'keyboard',
        explanation: 'A keyboard has keys, a space bar, and an enter key - playing with the double meanings of these words.',
        categorySlug: 'wordplay',
        difficulty: 'easy',
        hints: [
          { hintNumber: 1, text: 'Think about things you use with your fingers every day.', penaltyPercent: 10 },
          { hintNumber: 2, text: 'What do you use to type on a computer?', penaltyPercent: 20 },
        ],
      },
      {
        title: 'The Two Doors Riddle',
        question: 'You are in a room with two doors. One leads to certain death, the other to freedom. Two guards guard the doors - one always tells the truth, the other always lies. You can ask one guard one question. What question do you ask to find the door to freedom?',
        answer: 'what would the other guard say is the door to freedom',
        explanation: 'Ask either guard: "Which door would the other guard point to as the door to freedom?" Then choose the opposite door. Both guards will point to the death door.',
        categorySlug: 'logic',
        difficulty: 'hard',
        hints: [
          { hintNumber: 1, text: 'You need a question that both guards will answer the same way.', penaltyPercent: 10 },
          { hintNumber: 2, text: 'Think about what happens when you ask about what the OTHER guard would say.', penaltyPercent: 20 },
          { hintNumber: 3, text: 'The liar and the truth-teller cancel each other out when you ask about the other\'s answer.', penaltyPercent: 30 },
        ],
      },
      {
        title: 'The Monty Hall Problem',
        question: 'You\'re on a game show with three doors. Behind one is a car, behind the others are goats. You pick door #1. The host, who knows what\'s behind the doors, opens door #3 revealing a goat. He asks if you want to switch to door #2. Should you switch? What is the probability of winning if you switch?',
        answer: '66%',
        explanation: 'The Monty Hall problem shows that switching gives you a 2/3 chance of winning, while staying gives only 1/3. The host\'s action provides additional information.',
        categorySlug: 'math',
        difficulty: 'hard',
        hints: [
          { hintNumber: 1, text: 'When you first pick, your chance is 1/3. What happens to the remaining probability when a door is opened?', penaltyPercent: 10 },
          { hintNumber: 2, text: 'Think about it with 100 doors instead of 3.', penaltyPercent: 20 },
        ],
      },
      {
        title: 'The Silent Man',
        question: 'A man is found dead in a field with a backpack on. There is no one else around and no signs of struggle. The backpack is empty. How did he die?',
        answer: 'his parachute failed to open',
        explanation: 'The man was skydiving and his parachute failed. The "backpack" was his parachute pack.',
        categorySlug: 'lateral-thinking',
        difficulty: 'medium',
        hints: [
          { hintNumber: 1, text: 'What kind of backpack could be vital for survival?', penaltyPercent: 10 },
          { hintNumber: 2, text: 'Think about activities where you\'re high up and need equipment to survive.', penaltyPercent: 20 },
        ],
      },
      {
        title: 'What Runs Around The Whole Yard?',
        question: 'What runs all around the backyard yet never moves?',
        answer: 'fence',
        explanation: 'A fence "runs around" the yard but doesn\'t actually move - it\'s a play on words.',
        categorySlug: 'wordplay',
        difficulty: 'easy',
        hints: [
          { hintNumber: 1, text: 'Think about the perimeter of a yard.', penaltyPercent: 10 },
        ],
      },
    ];

    for (const rData of riddles) {
      const { hints, categorySlug, ...riddleData } = rData;
      const categoryId = catMap.get(categorySlug);
      if (!categoryId) continue;

      const riddle = this.riddleRepo.create({
        ...riddleData,
        categoryId,
        creatorId: adminId,
        status: 'approved',
        isDaily: false,
      });
      const saved = (await this.riddleRepo.save(riddle) as unknown as Riddle);

      if (hints) {
        const hintEntities = hints.map((h) => this.hintRepo.create({ ...h, riddleId: saved.id }));
        await this.hintRepo.save(hintEntities as unknown as Hint[]);
      }
    }
    console.log('  Sample riddles seeded');
  }

  private async seedDailyRiddle() {
    const today = '2026-07-25';
    const existing = await this.dailyRepo.findOne({ where: { date: today } });
    if (existing) return;

    const riddle = await this.riddleRepo.findOne({ where: { title: 'What Has Keys But Cannot Open Locks?' } });
    if (!riddle) return;

    const daily = this.dailyRepo.create({
      riddleId: riddle.id,
      date: today,
      bonusMultiplier: 1.5,
    });
    await this.dailyRepo.save(daily as unknown as DailyRiddle);

    // Mark the riddle as daily
    await this.riddleRepo.update(riddle.id, { isDaily: true });
    console.log('  Daily riddle seeded');
  }
}
