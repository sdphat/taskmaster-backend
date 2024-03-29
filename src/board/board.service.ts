import { ForbiddenException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

const boardSelect = {
  id: true,
  name: true,
  background: {
    select: {
      id: true,
      name: true,
      type: true,
      url: true,
    },
  },
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
          Labels: true,
          summary: true,
          cardIdx: true,
          Attachments: true,
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
      hasJoined: true,
      id: true,
    },
  },
} satisfies Prisma.BoardSelect;

export interface CreateBoardArgs {
  title: string;
  userId: number;
}

export interface UpdateBoardArgs {
  id: number;
  name?: string;
  backgroundUrl?: string;
}
@Injectable()
export class BoardService {
  constructor(private prismaService: PrismaService) {}

  async getAllBoards(userId: number) {
    const boards = await this.prismaService.board.findMany({
      where: { BoardMembers: { some: { userId } } },
      select: {
        background: {
          select: {
            id: true,
            name: true,
            type: true,
            url: true,
          },
        },
        name: true,
        id: true,
      },
    });

    return boards;
  }

  async getBoard(where: Prisma.BoardWhereInput) {
    const board = await this.prismaService.board.findFirst({
      where,
      select: boardSelect,
    });

    if (!board) {
      throw new ForbiddenException();
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
            hasJoined: true,
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

  async updateBoard({ id, name, backgroundUrl }: UpdateBoardArgs) {
    try {
      return await this.prismaService.board.update({
        data: {
          name,
          ...(backgroundUrl && {
            background: {
              connect: {
                url: backgroundUrl,
              },
            },
          }),
        },
        where: { id },
      });
    } catch (err) {
      console.log(err);
      throw new ForbiddenException();
    }
  }
}
