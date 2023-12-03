import { IsInt } from 'class-validator';

export class BoardCardMoveDto {
  @IsInt()
  fromIdx: number;
  @IsInt()
  fromColumn: number;
  @IsInt()
  toIdx: number;
  @IsInt()
  toColumn: number;
}
