import { Body, Controller, Post, Put, Request } from '@nestjs/common';
import { BoardCardCreateDto } from './dto/board-card-create.dto';
import { BoardCardService } from './board-card.service';
import { BoardCardReturnCreate } from './dto/board-card-return-create.dto';
import { BoardCardMoveDto } from './dto/board-card-move.dto';
import { BoardCardReturnMove } from './dto/board-card-return-move.dto';
import { BoardCardUpdateDto } from './dto/board-card-update.dto';
import { BoardCardReturnUpdate } from './dto/board-card-return-update.dto';

@Controller('board-card')
export class BoardCardController {
  constructor(private boardCardService: BoardCardService) {}

  @Post()
  async create(
    @Body() data: BoardCardCreateDto,
  ): Promise<BoardCardReturnCreate> {
    return this.boardCardService.create(data);
  }

  @Put()
  async update(
    @Body() data: BoardCardUpdateDto,
  ): Promise<BoardCardReturnUpdate> {
    return this.boardCardService.update(data.cardId, data);
  }

  @Post('move')
  async move(
    @Body() data: BoardCardMoveDto,
    @Request() req,
  ): Promise<BoardCardReturnMove> {
    return this.boardCardService.moveBoardCard({
      ...data,
      userId: req.user.id,
    });
  }
}
