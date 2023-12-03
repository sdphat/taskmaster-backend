import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

export interface MoveBoardCardInput {
  fromIdx: number;
  fromColumn: number;
  toIdx: number;
  toColumn: number;
  userId: number;
}

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
        select: {
          id: true,
          summary: true,
          boardColumnId: true,
          cardIdx: true,
        },
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
    });

    return card;
  }
}
