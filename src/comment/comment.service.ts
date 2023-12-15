import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

export interface CreateCommentArgs {
  cardId: number;
  createdDate: Date;
  content: string;
  userEmail: string;
}

@Injectable()
export class CommentService {
  constructor(private prismaService: PrismaService) {}

  async create({ userEmail, cardId, content, createdDate }: CreateCommentArgs) {
    const user = await this.prismaService.user.findFirst({
      where: {
        email: userEmail,
      },
      select: {
        id: true,
      },
    });

    try {
      const comment = await this.prismaService.boardColumnCardComment.create({
        data: {
          content,
          createdDate: createdDate,
          Creator: {
            connect: {
              id: user.id,
            },
          },
          BoardColumnCard: {
            connect: {
              id: cardId,
            },
          },
        },
        select: {
          Creator: {
            select: {
              id: true,
              email: true,
              fullName: true,
              avatarUrl: true,
            },
          },
          id: true,
          content: true,
          boardColumnCardId: true,
          createdDate: true,
        },
      });
      return comment;
    } catch (err) {
      throw new ForbiddenException();
    }
  }
}
