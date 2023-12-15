import { ForbiddenException, Injectable } from '@nestjs/common';
import { BoardColumnCard, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

export interface MoveBoardCardInput {
  fromIdx: number;
  fromColumn: number;
  toIdx: number;
  toColumn: number;
  userId: number;
}

export interface BoardCardUpdateData {
  description?: string;
  summary?: string;
  dueDate?: Date;
  labels?: number[];
}

export const cardSelectFields = {
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
          id: true,
          avatarUrl: true,
          email: true,
          fullName: true,
        },
      },
      id: true,
    },
  },
  description: true,
  dueDate: true,
  Labels: true,
  Members: true,
  summary: true,
  cardIdx: true,
  boardColumnId: true,
} satisfies Prisma.BoardColumnCardSelect;

@Injectable()
export class BoardCardService {
  constructor(private prismaService: PrismaService) {}

  private async getNextCardId(boardColumnId: number) {
    const {
      _max: { cardIdx: currentMaxCardIdx },
    } = await this.prismaService.boardColumnCard.aggregate({
      _max: {
        cardIdx: true,
      },
      where: {
        boardColumnId: boardColumnId,
      },
    });
    const nextCardIdx = currentMaxCardIdx + 1;
    return nextCardIdx;
  }

  async create(
    data: Pick<
      Prisma.BoardColumnCardCreateManyInput,
      'summary' | 'boardColumnId'
    >,
  ) {
    try {
      const nextCardIdx = await this.getNextCardId(data.boardColumnId);

      const newCard = await this.prismaService.boardColumnCard.create({
        data: {
          ...data,
          description: '',
          cardIdx: nextCardIdx,
        },
        select: cardSelectFields,
      });
      return newCard;
    } catch (err) {
      throw new ForbiddenException();
    }
  }

  async moveBoardCard(data: MoveBoardCardInput) {
    // Make space for the card in destination column
    await this.prismaService.boardColumnCard.updateMany({
      where: {
        boardColumnId: data.toColumn,
        cardIdx: {
          gte: data.toIdx,
        },
      },
      data: {
        cardIdx: {
          increment: 1,
        },
      },
    });

    // Move the card to destination
    await this.prismaService.boardColumnCard.updateMany({
      where: {
        boardColumnId: data.fromColumn,
        cardIdx: data.fromIdx,
      },
      data: {
        boardColumnId: data.toColumn,
        cardIdx: data.toIdx,
      },
    });

    // Fill the gap in source column
    await this.prismaService.boardColumnCard.updateMany({
      where: {
        boardColumnId: data.fromColumn,
        cardIdx: {
          gt: data.fromIdx,
        },
      },
      data: {
        cardIdx: {
          decrement: 1,
        },
      },
    });

    const card = await this.prismaService.boardColumnCard.findFirst({
      where: {
        boardColumnId: data.toColumn,
        cardIdx: data.toIdx,
      },
      select: cardSelectFields,
    });

    return card;
  }
  async update(id: BoardColumnCard['id'], data: BoardCardUpdateData) {
    const card = await this.prismaService.boardColumnCard.findFirst({
      where: {
        id,
      },
      select: {
        summary: true,
        description: true,
        dueDate: true,
        BoardColumn: {
          select: {
            boardId: true,
          },
        },
      },
    });

    if (!card) {
      throw new ForbiddenException();
    }

    return this.prismaService.boardColumnCard.update({
      where: { id },
      data: {
        summary: data.summary ?? card.summary,
        description: data.description ?? card.description,
        dueDate: data.dueDate ?? card.dueDate,
        Labels: {
          connect: (data.labels ?? []).map((labelId) => ({
            id: labelId,
          })),
        },
      },
      select: cardSelectFields,
    });
  }
}
