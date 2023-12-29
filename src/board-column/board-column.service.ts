import { ForbiddenException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

export interface CreateColumnArgs {
  columnName: string;
  boardId: number;
  userId: number;
}

const boardSelect = {
  name: true,
  id: true,
  BoardColumnCards: {
    select: {
      id: true,
      Comments: {
        orderBy: {
          id: 'desc',
        },
        select: {
          content: true,
          createdDate: true,
          Creator: {
            select: {
              User: {
                select: {
                  id: true,
                  avatarUrl: true,
                  email: true,
                  fullName: true,
                },
              },
              memberRole: true,
              hasJoined: true,
            },
          },
          id: true,
        },
      },
      BoardColumnCardMembers: {
        select: {
          boardMemberId: true,
          Member: {
            select: {
              id: true,
              memberRole: true,
              hasJoined: true,
              User: {
                select: {
                  id: true,
                  avatarUrl: true,
                  email: true,
                  fullName: true,
                },
              },
            },
          },
        },
      },
      description: true,
      dueDate: true,
      Labels: true,
      summary: true,
      cardIdx: true,
    },
  },
} satisfies Prisma.BoardColumnSelect;

@Injectable()
export class BoardColumnService {
  constructor(private prismaService: PrismaService) {}

  private async findLastIdx(boardId: number) {
    const {
      _max: { columnIdx: lastIdx },
    } = await this.prismaService.boardColumn.aggregate({
      _max: {
        columnIdx: true,
      },
      where: {
        boardId: boardId,
      },
    });

    return lastIdx ?? 0;
  }

  async create({ columnName, boardId, userId }: CreateColumnArgs) {
    try {
      return await this.prismaService.boardColumn.create({
        data: {
          name: columnName,
          columnIdx: await this.findLastIdx(boardId),
          Board: {
            connect: {
              id: boardId,
            },
          },
          creator: {
            connect: {
              userId_boardId: {
                boardId,
                userId,
              },
            },
          },
        },
        select: boardSelect,
      });
    } catch (err) {
      console.log(err);
      throw new ForbiddenException();
    }
  }

  async delete(id: number) {
    try {
      return await this.prismaService.boardColumn.delete({
        where: {
          id,
        },
      });
    } catch (err) {
      throw new ForbiddenException();
    }
  }
}
