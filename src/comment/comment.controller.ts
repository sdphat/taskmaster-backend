import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Request as ExpressRequest } from 'express';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@UseGuards(RolesGuard)
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Roles(['ADMIN', 'COLLABORATOR'])
  @Post()
  create(
    @Body() createCommentDto: CreateCommentDto,
    @Request() request: ExpressRequest,
  ) {
    return this.commentService.create({
      cardId: createCommentDto.cardId,
      content: createCommentDto.content,
      createdDate: createCommentDto.createdDate,
      userEmail: (request as any).user.email,
    });
  }
}
