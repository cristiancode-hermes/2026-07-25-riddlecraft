import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    register(username: string, email: string, password: string): Promise<{
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
    login(email: string, password: string): Promise<{
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
    updateProfile(userId: string, data: {
        username?: string;
    }): Promise<{
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
    private generateToken;
    toProfile(user: User): {
        id: string;
        username: string;
        email: string;
        xp: number;
        level: number;
        role: "user" | "admin";
        createdAt: string;
    };
}
//# sourceMappingURL=auth.service.d.ts.map