import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class BoardService {
  constructor(private prismaService: PrismaService) {}

  async getBoard(where: Prisma.BoardWhereInput) {
    const board = await this.prismaService.board.findFirst({
      where,
      select: {
        id: true,
        name: true,
        BoardColumns: {
          select: {
            name: true,
            id: true,
            BoardColumnCards: true,
          },
        },
        BoardLabels: true,
        BoardMembers: {
          select: {
            Member: {
              select: {
                id: true,
                email: true,
                fullName: true,
              },
            },
            memberRole: true,
            memberId: true,
          },
        },
      },
    });

    if (!board) {
      throw new NotFoundException();
    }
    return board;
  }
}
