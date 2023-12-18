import { ForbiddenException, Injectable } from '@nestjs/common';
import { BoardRole } from '@prisma/client';
import { PrismaService } from '../prisma.service';

export interface AddMemberArgs {
  boardId: number;
  invitedUserId: number;
  memberRole: BoardRole;
}

@Injectable()
export class MemberService {
  constructor(private prismaService: PrismaService) {}
  async addMemberToBoard({
    boardId,
    invitedUserId,
    memberRole,
  }: AddMemberArgs) {
    try {
      return await this.prismaService.boardMember.create({
        data: {
          memberRole,
          boardId,
          userId: invitedUserId,
        },
        select: {
          boardId: true,
          memberRole: true,
          id: true,
          User: {
            select: {
              avatarUrl: true,
              email: true,
              fullName: true,
            },
          },
        },
      });
    } catch (err) {
      throw new ForbiddenException();
    }
  }

  async removeMemberFromBoard(boardId: number, userId: number) {
    try {
      await this.prismaService.boardMember.delete({
        where: {
          userId_boardId: {
            boardId,
            userId,
          },
        },
      });
    } catch (err) {
      throw new ForbiddenException();
    }
  }

  async removeMemberFromCard(cardId: number, memberId: number) {
    try {
      await this.prismaService.boardColumnCardMembers.delete({
        where: {
          boardMemberId_boardColumnCardId: {
            boardColumnCardId: cardId,
            boardMemberId: memberId,
          },
        },
      });
    } catch (err) {
      throw new ForbiddenException();
    }
  }

  async addMemberToCard(cardId: number, memberId: number) {
    try {
      return await this.prismaService.boardColumnCardMembers.create({
        data: {
          boardColumnCardId: cardId,
          boardMemberId: memberId,
        },
        select: {
          boardMemberId: true,
          Member: {
            select: {
              memberRole: true,
              id: true,
              User: {
                select: {
                  avatarUrl: true,
                  email: true,
                  fullName: true,
                },
              },
            },
          },
        },
      });
    } catch (err) {
      throw new ForbiddenException();
    }
  }
}
