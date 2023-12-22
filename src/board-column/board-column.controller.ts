import { Body, Controller, Post, Request } from '@nestjs/common';
import { BoardColumnService } from './board-column.service';
import { CreateBoardColumnDto } from './dto/create-board-column.dto';
import { Request as ExpressRequest } from 'express';

@Controller('board-column')
export class BoardColumnController {
  constructor(private readonly boardColumnService: BoardColumnService) {}

  @Post()
  create(
    @Body() createBoardColumnDto: CreateBoardColumnDto,
    @Request() request: ExpressRequest,
  ) {
    return this.boardColumnService.create({
      ...createBoardColumnDto,
      userId: (request as any).user.sub,
    });
  }
}
