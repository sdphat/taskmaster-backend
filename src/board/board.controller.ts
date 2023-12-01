import { Controller, Get, Param } from '@nestjs/common';
import { BoardService } from './board.service';

@Controller('board')
export class BoardController {
  constructor(private boardService: BoardService) {}

  @Get(':boardId')
  async getBoard(
    @Param('boardId') boardId: number,
  ): Promise<ReturnType<typeof this.boardService.getBoard>> {
    return this.boardService.getBoard({ id: +boardId });
  }
}
