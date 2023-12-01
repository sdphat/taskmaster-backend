import { Body, Controller, Post } from '@nestjs/common';
import { BoardCardCreateDto } from './dto/board-card-create.dto';
import { BoardCardService } from './board-card.service';
import { BoardCardReturnCreate } from './dto/board-card-return-create.dto';

@Controller('board-card')
export class BoardCardController {
  constructor(private boardCardService: BoardCardService) {}

  @Post()
  async create(
    @Body() data: BoardCardCreateDto,
  ): Promise<BoardCardReturnCreate> {
    return this.boardCardService.create(data);
  }
}
