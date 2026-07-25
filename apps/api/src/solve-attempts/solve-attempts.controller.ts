import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { SolveAttemptsService } from './solve-attempts.service';
import { SubmitAnswerDto } from './dto/solve-attempt.dto';
import { RiddlesService } from '../riddles/riddles.service';

@ApiTags('Solve Attempts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class SolveAttemptsController {
  constructor(
    private readonly solveAttemptsService: SolveAttemptsService,
    private readonly riddlesService: RiddlesService,
  ) {}

  @Post('riddles/:id/attempt')
  async createAttempt(@CurrentUser() user: any, @Param('id') riddleId: string) {
    const attempt = await this.solveAttemptsService.createOrUpdate(user.id, riddleId);
    return { attempt };
  }

  @Post('attempts/:id/submit')
  async submitAnswer(@Param('id') id: string, @Body() dto: SubmitAnswerDto) {
    return this.solveAttemptsService.submitAnswer(id, dto.answer);
  }

  @Post('attempts/:id/hint')
  async requestHint(@Param('id') id: string) {
    const result = await this.solveAttemptsService.requestHint(id);
    if (!result) {
      return { hint: null, message: 'No more hints available' };
    }
    return result;
  }

  @Get('attempts/:id')
  async getAttempt(@Param('id') id: string) {
    const attempt = await this.solveAttemptsService.findById(id);
    if (!attempt) {
      return { error: { statusCode: 404, message: 'Attempt not found' } };
    }
    return { attempt };
  }

  @Get('solves/history')
  async getHistory(
    @CurrentUser() user: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.solveAttemptsService.getHistory(user.id, page ?? 1, limit ?? 20);
  }
}
