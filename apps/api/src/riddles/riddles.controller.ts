import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RiddlesService } from './riddles.service';
import { CreateRiddleDto, UpdateRiddleDto, RateRiddleDto, QueryRiddlesDto } from './dto/riddle.dto';

@ApiTags('Riddles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('riddles')
export class RiddlesController {
  constructor(private readonly riddlesService: RiddlesService) {}

  @Get('daily')
  async getDailyRiddle(@CurrentUser() user: any) {
    const riddle = await this.riddlesService.findDailyRiddle();
    if (!riddle) {
      return { riddle: null, solved: false };
    }
    return {
      riddle,
      solved: false,
      attempt: null,
    };
  }

  @Get()
  async findAll(@Query() query: QueryRiddlesDto) {
    return this.riddlesService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const riddle = await this.riddlesService.findById(id, true);
    if (!riddle) {
      return { error: { statusCode: 404, message: 'Riddle not found' } };
    }
    return { riddle };
  }

  @Post()
  async create(@CurrentUser() user: any, @Body() dto: CreateRiddleDto) {
    const riddle = await this.riddlesService.create(
      {
        title: dto.title,
        question: dto.question,
        answer: dto.answer,
        explanation: dto.explanation,
        categoryId: dto.categoryId,
        difficulty: dto.difficulty ?? 'medium',
        creatorId: user.id,
        status: 'pending',
      },
      dto.hints,
    );
    return { riddle };
  }

  @Put(':id')
  async update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: UpdateRiddleDto,
  ) {
    const existing = await this.riddlesService.findById(id);
    if (!existing) {
      return { error: { statusCode: 404, message: 'Riddle not found' } };
    }
    if (existing.creatorId !== user.id && user.role !== 'admin') {
      return { error: { statusCode: 403, message: 'Not authorized' } };
    }
    const updateData: any = {};
    if (dto.title !== undefined) updateData.title = dto.title;
    if (dto.question !== undefined) updateData.question = dto.question;
    if (dto.answer !== undefined) updateData.answer = dto.answer;
    if (dto.explanation !== undefined) updateData.explanation = dto.explanation;
    if (dto.categoryId !== undefined) updateData.categoryId = dto.categoryId;
    if (dto.difficulty !== undefined) updateData.difficulty = dto.difficulty;

    const riddle = await this.riddlesService.update(id, updateData, dto.hints);
    return { riddle };
  }

  @Delete(':id')
  async delete(@CurrentUser() user: any, @Param('id') id: string) {
    const existing = await this.riddlesService.findById(id);
    if (!existing) {
      return { error: { statusCode: 404, message: 'Riddle not found' } };
    }
    if (existing.creatorId !== user.id && user.role !== 'admin') {
      return { error: { statusCode: 403, message: 'Not authorized' } };
    }
    await this.riddlesService.delete(id);
    return { success: true };
  }

  @Post(':id/rate')
  async rate(@Param('id') id: string, @Body() dto: RateRiddleDto) {
    const riddle = await this.riddlesService.rate(id, dto.rating);
    return { riddle };
  }
}
