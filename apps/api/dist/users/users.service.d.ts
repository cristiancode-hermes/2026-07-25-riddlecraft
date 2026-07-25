import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserSettings } from './user-settings.entity';
export declare class UsersService {
    private readonly userRepo;
    private readonly settingsRepo;
    constructor(userRepo: Repository<User>, settingsRepo: Repository<UserSettings>);
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findByUsername(username: string): Promise<User | null>;
    createUser(data: Partial<User>): Promise<User>;
    updateUser(id: string, data: Partial<User>): Promise<User>;
    addXp(id: string, xp: number): Promise<User>;
    calculateLevel(xp: number): number;
    xpForLevel(level: number): number;
    getSettings(userId: string): Promise<UserSettings | null>;
    updateSettings(userId: string, data: Partial<UserSettings>): Promise<UserSettings>;
}
//# sourceMappingURL=users.service.d.ts.map