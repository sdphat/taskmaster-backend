import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

const boardSelect = {
  id: true,
  name: true,
  backgroundUrl: true,
  BoardColumns: {
    select: {
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
    },
  },
  BoardLabels: true,
  BoardMembers: {
    select: {
      User: {
        select: {
          id: true,
          email: true,
          fullName: true,
          avatarUrl: true,
        },
      },
      memberRole: true,
      id: true,
    },
  },
} satisfies Prisma.BoardSelect;

export interface CreateBoardArgs {
  title: string;
  userId: number;
}
@Injectable()
export class BoardService {
  constructor(private prismaService: PrismaService) {}

  async getAllBoards(userId: number) {
    const boards = await this.prismaService.board.findMany({
      where: { BoardMembers: { some: { userId } } },
      select: { backgroundUrl: true, name: true, id: true },
    });

    return boards;
  }

  async getBoard(where: Prisma.BoardWhereInput) {
    const board = await this.prismaService.board.findFirst({
      where,
      select: boardSelect,
    });

    if (!board) {
      throw new NotFoundException();
    }
    return board;
  }

  async createBoard(data: CreateBoardArgs) {
    return await this.prismaService.board.create({
      data: {
        name: data.title,
        BoardMembers: {
          create: {
            User: {
              connect: {
                id: data.userId,
              },
            },
            memberRole: 'ADMIN',
          },
        },
      },
      select: boardSelect,
    });
  }

  async deleteBoard(id: number) {
    try {
      return await this.prismaService.board.delete({ where: { id } });
    } catch (err) {
      throw new ForbiddenException();
    }
  }
}
