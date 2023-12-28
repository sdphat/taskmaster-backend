import { BoardRole } from '@prisma/client';
import { IsEmail, IsEnum, IsInt } from 'class-validator';

export class AddMemberToBoardDto {
  @IsInt()
  boardId: number;
  @IsEmail()
  email: string;
  @IsEnum(BoardRole)
  memberRole: BoardRole;
}
