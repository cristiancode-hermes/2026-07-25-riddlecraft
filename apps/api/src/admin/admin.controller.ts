import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';
import { AdminService } from './admin.service';
import { SetDailyRiddleDto } from '../daily-riddle/dto/daily-riddle.dto';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  async getStats() {
    return this.adminService.getStats();
  }

  @Get('reports')
  async getReports() {
    const items = await this.adminService.getReports();
    return { items };
  }

  @Post('riddles/:id/approve')
  async approveRiddle(@Param('id') id: string) {
    await this.adminService.approveRiddle(id);
    return { success: true };
  }

  @Post('riddles/:id/reject')
  async rejectRiddle(@Param('id') id: string) {
    await this.adminService.rejectRiddle(id);
    return { success: true };
  }

  @Post('users/:id/ban')
  async banUser(@Param('id') id: string) {
    await this.adminService.banUser(id);
    return { success: true };
  }

  @Post('daily')
  async setDailyRiddle(@Body() dto: SetDailyRiddleDto) {
    return this.adminService.setDailyRiddle({
      riddleId: dto.riddleId,
      date: dto.date,
      bonusMultiplier: dto.bonusMultiplier ?? undefined,
    });
  }

  @Get('daily/schedule')
  async getDailySchedule() {
    const items = await this.adminService.getDailySchedule();
    return { items };
  }

  @Delete('daily/:id')
  async deleteDaily(@Param('id') id: string) {
    await this.adminService.deleteDaily(id);
    return { success: true };
  }
}
