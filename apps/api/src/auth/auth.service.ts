import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { JwtPayload } from '../common/interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(username: string, email: string, password: string) {
    const existing = await this.usersService.findByEmail(email);
    if (existing) {
      throw new UnauthorizedException('Email already in use');
    }
    const existingUsername = await this.usersService.findByUsername(username);
    if (existingUsername) {
      throw new UnauthorizedException('Username already in use');
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.usersService.createUser({ username, email, passwordHash });
    const token = this.generateToken(user);
    return { user: this.toProfile(user), token };
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = this.generateToken(user);
    return { user: this.toProfile(user), token };
  }

  async updateProfile(userId: string, data: { username?: string }) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    if (data.username !== undefined && data.username !== user.username) {
      const existing = await this.usersService.findByUsername(data.username);
      if (existing) {
        throw new UnauthorizedException('Username already in use');
      }
    }
    const updated = await this.usersService.updateUser(userId, data);
    return { user: this.toProfile(updated) };
  }

  private generateToken(user: User): string {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      username: user.username,
    };
    return this.jwtService.sign(payload);
  }

  toProfile(user: User) {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      xp: user.xp,
      level: user.level,
      role: user.role as 'user' | 'admin',
      createdAt: user.createdAt.toISOString(),
    };
  }
}
