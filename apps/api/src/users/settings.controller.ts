import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UsersService } from './users.service';
import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdateSettingsDto {
  @IsOptional()
  @IsString()
  theme?: string;

  @IsOptional()
  @IsBoolean()
  dailyReminder?: boolean;

  @IsOptional()
  @IsBoolean()
  notifications?: boolean;
}

@ApiTags('Settings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('settings')
export class SettingsController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getSettings(@CurrentUser() user: any) {
    const settings = await this.usersService.getSettings(user.id);
    if (!settings) {
      return { theme: 'system', dailyReminder: false, notifications: true };
    }
    return settings;
  }

  @Put()
  async updateSettings(@CurrentUser() user: any, @Body() dto: UpdateSettingsDto) {
    const updateData: any = {};
    if (dto.theme !== undefined) updateData.theme = dto.theme;
    if (dto.dailyReminder !== undefined) updateData.dailyReminder = dto.dailyReminder;
    if (dto.notifications !== undefined) updateData.notifications = dto.notifications;
    const settings = await this.usersService.updateSettings(user.id, updateData);
    return settings;
  }
}
