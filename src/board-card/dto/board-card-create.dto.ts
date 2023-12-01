import { IsNumber, IsString } from 'class-validator';

export class BoardCardCreateDto {
  @IsNumber()
  boardColumnId: number;

  @IsString()
  summary: string;
}
