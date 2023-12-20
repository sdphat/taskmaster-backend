import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { BoardCardService } from './board-card.service';
import { BoardCardCreateDto } from './dto/board-card-create.dto';
import { BoardCardMoveDto } from './dto/board-card-move.dto';
import { BoardCardReturnCreate } from './dto/board-card-return-create.dto';
import { BoardCardReturnMove } from './dto/board-card-return-move.dto';
import { BoardCardReturnUpdate } from './dto/board-card-return-update.dto';
import { BoardCardUpdateDto } from './dto/board-card-update.dto';

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

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) cardId: number) {
    return this.boardCardService.delete({
      cardId,
    });
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
