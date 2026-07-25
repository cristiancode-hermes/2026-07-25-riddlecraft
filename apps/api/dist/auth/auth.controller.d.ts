import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { UsersService } from '../users/users.service';
import { UpdateProfileDto } from '../users/dto/update-profile.dto';
export declare class AuthController {
    private readonly authService;
    private readonly usersService;
    constructor(authService: AuthService, usersService: UsersService);
    register(dto: RegisterDto): Promise<{
        user: {
            id: string;
            username: string;
            email: string;
            xp: number;
            level: number;
            role: "user" | "admin";
            createdAt: string;
        };
        token: string;
    }>;
    login(dto: LoginDto): Promise<{
        user: {
            id: string;
            username: string;
            email: string;
            xp: number;
            level: number;
            role: "user" | "admin";
            createdAt: string;
        };
        token: string;
    }>;
    me(user: any): Promise<{
        error: {
            statusCode: number;
            message: string;
        };
        user?: undefined;
    } | {
        user: {
            id: string;
            username: string;
            email: string;
            xp: number;
            level: number;
            role: "user" | "admin";
            createdAt: string;
        };
        error?: undefined;
    }>;
    updateProfile(user: any, dto: UpdateProfileDto): Promise<{
        user: {
            id: string;
            username: string;
            email: string;
            xp: number;
            level: number;
            role: "user" | "admin";
            createdAt: string;
        };
    }>;
}
//# sourceMappingURL=auth.controller.d.ts.map