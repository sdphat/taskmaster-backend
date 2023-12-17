import { IsInt } from 'class-validator';

export class RemoveMemberFromBoardDto {
  @IsInt()
  boardId: number;
  @IsInt()
  memberUserId: number;
}
