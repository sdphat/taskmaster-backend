import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class BoardCardService {
  constructor(private prismaService: PrismaService) {}

  async create(
    data: Pick<
      Prisma.BoardColumnCardCreateManyInput,
      'summary' | 'boardColumnId'
    >,
  ) {
    try {
      const newCard = await this.prismaService.boardColumnCard.create({
        data: {
          ...data,
          description: '',
        },
        select: {
          id: true,
          summary: true,
        },
      });
      return newCard;
    } catch (err) {
      throw new ForbiddenException();
    }
  }
}
