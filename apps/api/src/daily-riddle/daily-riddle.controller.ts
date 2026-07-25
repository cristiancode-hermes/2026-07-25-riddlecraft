import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Daily Riddle')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('daily-riddle')
export class DailyRiddleController {
  @Get('today')
  async getToday() {
    return { message: 'See /api/riddles/daily' };
  }
}
