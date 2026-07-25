export interface LoginDto {
    email: string;
    password: string;
}
export interface RegisterDto {
    username: string;
    email: string;
    password: string;
}
export interface AuthResponse {
    user: UserProfile;
    token: string;
}
export interface JwtPayload {
    sub: string;
    email: string;
    username: string;
}
export interface UserProfile {
    id: string;
    username: string;
    email: string;
    xp: number;
    level: number;
    role: 'user' | 'admin';
    createdAt: string;
}
export interface UserStats {
    xp: number;
    level: number;
    currentLevelXp: number;
    nextLevelXp: number;
    currentStreak: number;
    maxStreak: number;
    totalSolved: number;
    totalRiddlesCreated: number;
    achievementsUnlocked: number;
    achievementsTotal: number;
    averageTime: number;
}
export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    sortOrder: number;
}
export type Difficulty = 'easy' | 'medium' | 'hard';
export type RiddleStatus = 'pending' | 'approved' | 'rejected';
export interface Riddle {
    id: string;
    title: string;
    question: string;
    answer: string;
    explanation: string;
    categoryId: string;
    category?: Category;
    difficulty: Difficulty;
    creatorId: string;
    creator?: {
        username: string;
    };
    metadata: Record<string, any>;
    timesSolved: number;
    averageRating: number;
    ratingCount: number;
    isDaily: boolean;
    status: RiddleStatus;
    createdAt: string;
    updatedAt: string;
}
export interface CreateRiddleDto {
    title: string;
    question: string;
    answer: string;
    explanation: string;
    categoryId: string;
    difficulty: Difficulty;
    hints?: CreateHintDto[];
}
export interface UpdateRiddleDto extends Partial<CreateRiddleDto> {
}
export interface Hint {
    id: string;
    riddleId: string;
    hintNumber: number;
    text: string;
    penaltyPercent: number;
}
export interface CreateHintDto {
    hintNumber: number;
    text: string;
    penaltyPercent: number;
}
export interface DailyRiddle {
    id: string;
    riddleId: string;
    riddle?: Riddle;
    date: string;
    bonusMultiplier: number;
}
export interface DailyRiddleResponse {
    riddle: Riddle;
    solved: boolean;
    attempt?: SolveAttempt;
}
export interface SolveAttempt {
    id: string;
    userId: string;
    riddleId: string;
    dailyRiddleId?: string;
    solved: boolean;
    hintsUsed: number;
    timeSeconds: number;
    score: number;
    attempts: number;
    startedAt: string;
    completedAt?: string;
}
export interface SubmitAnswerDto {
    answer: string;
}
export interface SubmitAnswerResponse {
    correct: boolean;
    attempt: SolveAttempt;
    score?: number;
    newAchievements?: AchievementUnlock[];
    levelUp?: boolean;
}
export interface HintResponse {
    hint: Hint;
    penalty: number;
}
export interface LeaderboardEntry {
    rank: number;
    username: string;
    score: number;
    timeSeconds?: number;
    hintsUsed?: number;
    streak?: number;
    xp?: number;
    level?: number;
    totalSolved?: number;
}
export interface LeaderboardResponse {
    items: LeaderboardEntry[];
    userPosition?: {
        rank: number;
        score: number;
    };
}
export interface Achievement {
    id: string;
    key: string;
    name: string;
    description: string;
    iconUrl?: string;
    criteria: AchievementCriteria;
    xpReward: number;
}
export interface AchievementCriteria {
    type: 'solved_count' | 'streak_days' | 'fast_solve' | 'no_hints' | 'category_count' | 'created_count' | 'rating_threshold';
    threshold: number;
    categorySlug?: string;
}
export interface UserAchievement {
    id: string;
    userId: string;
    achievementId: string;
    achievement?: Achievement;
    unlockedAt: string;
}
export interface AchievementUnlock {
    achievement: Achievement;
    xpReward: number;
}
export interface Comment {
    id: string;
    userId: string;
    username: string;
    riddleId: string;
    text: string;
    createdAt: string;
    updatedAt?: string;
}
export interface CreateCommentDto {
    text: string;
}
export interface CreateRatingDto {
    rating: number;
    perceivedDifficulty?: string;
}
export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export interface ApiResponse<T> {
    data: T;
    meta?: {
        page: number;
        total: number;
        totalPages: number;
    };
}
export interface ApiError {
    error: {
        statusCode: number;
        message: string;
        details?: any;
    };
}
export interface UserSettings {
    id: string;
    userId: string;
    theme: 'light' | 'dark' | 'system';
    dailyReminder: boolean;
    notifications: boolean;
}
export interface UpdateSettingsDto {
    theme?: 'light' | 'dark' | 'system';
    dailyReminder?: boolean;
    notifications?: boolean;
}
export interface AdminStats {
    userCount: number;
    riddleCount: number;
    dailySolveCount: number;
    reportsCount: number;
}
export interface DailyScheduleEntry {
    id: string;
    riddleId: string;
    riddleTitle: string;
    date: string;
    bonusMultiplier: number;
}
export interface SetDailyRiddleDto {
    riddleId: string;
    date: string;
    bonusMultiplier?: number;
}
//# sourceMappingURL=index.d.ts.map