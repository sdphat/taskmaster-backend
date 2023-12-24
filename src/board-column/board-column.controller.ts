import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Request,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { BoardColumnService } from './board-column.service';
import { CreateBoardColumnDto } from './dto/create-board-column.dto';
import { Request as ExpressRequest } from 'express';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(RolesGuard)
@Controller('board-column')
export class BoardColumnController {
  constructor(private readonly boardColumnService: BoardColumnService) {}

  @Roles(['ADMIN', 'COLLABORATOR'])
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

  @Roles(['ADMIN', 'COLLABORATOR'])
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.boardColumnService.delete(id);
  }
}
