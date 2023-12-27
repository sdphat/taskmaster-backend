import { BoardRole } from '@prisma/client';
import { IsIn, IsInt } from 'class-validator';

export class ChangeMemberRoleDto {
  @IsIn(Object.values(BoardRole))
  role: BoardRole;

  @IsInt()
  memberId: number;
}
