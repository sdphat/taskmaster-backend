import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BoardRole } from '@prisma/client';
import { Cache } from 'cache-manager';
import ms from 'ms';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma.service';
import { InvitationDto } from './dto/invitation.dto';
import { InvitationCodeGeneratorService } from './invitation-code-generator/invitation-code-generator.service';
export interface AddMemberArgs {
  boardId: number;
  email: string;
  memberRole: BoardRole;
}

export interface ChangeMemberRoleArgs {
  role: BoardRole;
  memberId: number;
}

interface InvitationCacheData {
  boardId: number;
  email: string;
}

@Injectable()
export class MemberService {
  constructor(
    private prismaService: PrismaService,
    private invitationCodeGenerator: InvitationCodeGeneratorService,
    private mailSerivce: MailService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async handleInvitation(invitationDto: InvitationDto) {
    const data = await this.cacheManager.get<InvitationCacheData>(
      invitationDto.code,
    );
    if (!data) {
      throw new BadRequestException();
    }

    const foundUser = await this.prismaService.user.findFirst({
      where: {
        Credential: {
          email: data.email,
        },
      },
    });

    if (!foundUser) {
      throw new NotFoundException();
    }

    // Update hasJoined flag to true
    await this.prismaService.user.update({
      data: {
        BoardMember: {
          update: {
            data: {
              hasJoined: true,
            },
            where: {
              userId_boardId: {
                boardId: data.boardId,
                userId: foundUser.id,
              },
            },
          },
        },
      },
      where: {
        id: foundUser.id,
      },
    });

    return { boardId: data.boardId };
  }

  async addMemberToBoard({ boardId, email, memberRole }: AddMemberArgs) {
    try {
      const returnData = await this.prismaService.boardMember.create({
        data: {
          memberRole,
          hasJoined: false,
          Board: {
            connect: {
              id: boardId,
            },
          },
          User: {
            connectOrCreate: {
              create: {
                email,
                fullName: email,
                avatarUrl: '',
              },
              where: {
                email,
              },
            },
          },
        },
        select: {
          boardId: true,
          memberRole: true,
          hasJoined: true,
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

      const invitationCode = this.invitationCodeGenerator.generate();
      await this.cacheManager.set(invitationCode, { email, boardId }, ms('1d'));

      const board = await this.prismaService.board.findFirst({
        where: {
          id: boardId,
        },
      });

      await this.mailSerivce.send({
        from: this.mailSerivce.SYSTEM_EMAIL,
        isTransactional: true,
        to: email,
        subject: 'Invitation to Taskmaster board',
        bodyHtml: `You have been invited to join board <b>${board.name}</b>. <a href='${process.env['FRONT_END_URL']}/invitation?code=${invitationCode}'>Join board</a>`,
      });

      return returnData;
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
              hasJoined: true,
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
