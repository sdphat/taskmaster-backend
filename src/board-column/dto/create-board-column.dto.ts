import { IsInt, IsString } from 'class-validator';

export class CreateBoardColumnDto {
  @IsInt()
  boardId: number;

  @IsString()
  columnName: string;
}
