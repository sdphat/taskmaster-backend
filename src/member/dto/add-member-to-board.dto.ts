import { BoardRole } from '@prisma/client';
import { IsEnum, IsInt } from 'class-validator';

export class AddMemberToBoardDto {
  @IsInt()
  boardId: number;
  @IsInt()
  invitedUserId: number;
  @IsEnum(BoardRole)
  memberRole: BoardRole;
}
