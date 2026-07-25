import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from './entities';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { RiddlesModule } from './riddles/riddles.module';
import { DailyRiddleModule } from './daily-riddle/daily-riddle.module';
import { SolveAttemptsModule } from './solve-attempts/solve-attempts.module';
import { AchievementsModule } from './achievements/achievements.module';
import { CommentsModule } from './comments/comments.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { AdminModule } from './admin/admin.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'better-sqlite3',
        database: config.get<string>('DATABASE_PATH', './data/riddlecraft.db'),
        entities,
        synchronize: true,
        autoLoadEntities: false,
      }),
    }),
    UsersModule,
    AuthModule,
    CategoriesModule,
    RiddlesModule,
    DailyRiddleModule,
    SolveAttemptsModule,
    AchievementsModule,
    CommentsModule,
    LeaderboardModule,
    AdminModule,
    SeedModule,
  ],
})
export class AppModule {}
