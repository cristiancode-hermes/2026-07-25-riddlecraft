import { UsersService } from './users.service';
export declare class UpdateSettingsDto {
    theme?: string;
    dailyReminder?: boolean;
    notifications?: boolean;
}
export declare class SettingsController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getSettings(user: any): Promise<import("./user-settings.entity").UserSettings | {
        theme: string;
        dailyReminder: boolean;
        notifications: boolean;
    }>;
    updateSettings(user: any, dto: UpdateSettingsDto): Promise<import("./user-settings.entity").UserSettings>;
}
//# sourceMappingURL=settings.controller.d.ts.map