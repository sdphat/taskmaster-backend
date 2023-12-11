import { Body, Controller, Post, Request } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Request as ExpressRequest } from 'express';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

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
