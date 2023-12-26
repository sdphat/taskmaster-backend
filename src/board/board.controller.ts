import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';
import ms from 'ms';
import { cookieConstants } from '../auth/constants';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('board')
export class BoardController {
  constructor(private boardService: BoardService) {}

  @Get('all-boards')
  async getAllBoards(
    @Req() request: ExpressRequest,
  ): Promise<ReturnType<typeof this.boardService.getAllBoards>> {
    const boards = await this.boardService.getAllBoards(
      (request as any).user.sub,
    );

    return boards;
  }

  @Get(':boardId')
  async getBoard(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Req() request: ExpressRequest,
    @Res({ passthrough: true }) response: ExpressResponse,
  ): Promise<ReturnType<typeof this.boardService.getBoard>> {
    const board = await this.boardService.getBoard({ id: +boardId });
    const currentUserMember = board.BoardMembers.find(
      (member) => member.User.id === (request as any).user.sub,
    );

    if (!currentUserMember) {
      throw new ForbiddenException();
    }

    response.cookie(
      cookieConstants.roleCookieToken,
      currentUserMember.memberRole,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        maxAge: ms('5m'),
        // domain: 'localhost',
        sameSite: 'strict',
      },
    );

    return board;
  }

  @Post()
  async create(@Body() data: CreateBoardDto, @Req() req: ExpressRequest) {
    return this.boardService.createBoard({
      ...data,
      userId: (req as any).user.sub,
    });
  }

  @Roles(['ADMIN'])
  @UseGuards(RolesGuard)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.boardService.deleteBoard(id);
  }
}
