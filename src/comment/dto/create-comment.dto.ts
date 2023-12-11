import { IsDateString, IsNumber, IsString, Length } from 'class-validator';

export class CreateCommentDto {
  @IsNumber()
  cardId: number;

  @IsDateString()
  createdDate: Date;

  @IsString()
  @Length(1)
  content: string;
}
