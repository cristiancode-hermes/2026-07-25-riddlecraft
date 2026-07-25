import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AchievementsService } from './achievements.service';
import { UserAchievementsService } from '../user-achievements/user-achievements.service';

@ApiTags('Achievements')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('achievements')
export class AchievementsController {
  constructor(
    private readonly achievementsService: AchievementsService,
    private readonly userAchievementsService: UserAchievementsService,
  ) {}

  @Get()
  async findAll() {
    const items = await this.achievementsService.findAll();
    return { items };
  }

  @Get('user')
  async getUserAchievements() {
    return { items: [] };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const achievement = await this.achievementsService.findById(id);
    if (!achievement) {
      return { error: { statusCode: 404, message: 'Achievement not found' } };
    }
    return achievement;
  }
}
