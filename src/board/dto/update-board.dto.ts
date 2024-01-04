import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateBoardDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsUrl()
  backgroundUrl?: string;
}
