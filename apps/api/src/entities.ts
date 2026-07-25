import { User } from './users/user.entity';
import { UserSettings } from './users/user-settings.entity';
import { Category } from './categories/category.entity';
import { Riddle } from './riddles/riddle.entity';
import { Hint } from './hints/hint.entity';
import { DailyRiddle } from './daily-riddle/daily-riddle.entity';
import { SolveAttempt } from './solve-attempts/solve-attempt.entity';
import { Achievement } from './achievements/achievement.entity';
import { UserAchievement } from './user-achievements/user-achievement.entity';
import { Comment } from './comments/comment.entity';

export const entities = [
  User,
  UserSettings,
  Category,
  Riddle,
  Hint,
  DailyRiddle,
  SolveAttempt,
  Achievement,
  UserAchievement,
  Comment,
];
