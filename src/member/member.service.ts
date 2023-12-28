import { ForbiddenException, Injectable } from '@nestjs/common';
import { BoardRole } from '@prisma/client';
import { PrismaService } from '../prisma.service';

export interface AddMemberArgs {
  boardId: number;
  email: string;
  memberRole: BoardRole;
}

export interface ChangeMemberRoleArgs {
  role: BoardRole;
  memberId: number;
}

@Injectable()
export class MemberService {
  constructor(private prismaService: PrismaService) {}

  async addMemberToBoard({ boardId, email, memberRole }: AddMemberArgs) {
    try {
      return await this.prismaService.boardMember.create({
        data: {
          memberRole,
          Board: {
            connect: {
              id: boardId,
            },
          },
          User: {
            connect: {
              email,
            },
          },
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

  async changeMemberRole(args: ChangeMemberRoleArgs) {
    try {
      return await this.prismaService.boardMember.update({
        data: {
          memberRole: args.role,
        },
        where: {
          id: args.memberId,
        },
      });
    } catch (err) {
      throw new ForbiddenException();
    }
  }
}
