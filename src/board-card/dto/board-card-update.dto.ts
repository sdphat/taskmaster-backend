import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';
import { BoardCardUpdateData } from '../board-card.service';

export class BoardCardUpdateDto implements BoardCardUpdateData {
  @IsNumber()
  cardId: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: Date;

  @IsOptional()
  @IsNumber({}, { each: true })
  labels?: number[];

  @IsOptional()
  @IsString({ each: true })
  attachments?: string[];
}
