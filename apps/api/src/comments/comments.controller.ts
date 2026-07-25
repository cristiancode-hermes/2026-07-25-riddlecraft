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
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/comment.dto';

@ApiTags('Comments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('riddles/:riddleId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  async findByRiddle(@Param('riddleId') riddleId: string) {
    const items = await this.commentsService.findByRiddleId(riddleId);
    return {
      items: items.map((c) => ({
        id: c.id,
        userId: c.userId,
        username: c.user?.username ?? 'unknown',
        riddleId: c.riddleId,
        text: c.text,
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt?.toISOString(),
      })),
    };
  }

  @Post()
  async create(
    @CurrentUser() user: any,
    @Param('riddleId') riddleId: string,
    @Body() dto: CreateCommentDto,
  ) {
    const comment = await this.commentsService.create({
      userId: user.id,
      riddleId,
      text: dto.text,
    });
    return {
      id: comment.id,
      userId: comment.userId,
      username: user.username,
      riddleId: comment.riddleId,
      text: comment.text,
      createdAt: comment.createdAt.toISOString(),
    };
  }

  @Delete(':id')
  async delete(@CurrentUser() user: any, @Param('id') id: string) {
    const comment = await this.commentsService.findById(id);
    if (!comment) {
      return { error: { statusCode: 404, message: 'Comment not found' } };
    }
    if (comment.userId !== user.id && user.role !== 'admin') {
      return { error: { statusCode: 403, message: 'Not authorized' } };
    }
    await this.commentsService.delete(id);
    return { success: true };
  }
}
