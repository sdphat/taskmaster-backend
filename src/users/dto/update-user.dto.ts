import { PickType } from '@nestjs/mapped-types';
import { IsOptional, IsString, IsUrl, MinLength } from 'class-validator';
import { User } from '../../types/board';

export class UpdateUserDto extends PickType(User, ['fullName']) {
  @IsOptional()
  @IsString()
  @MinLength(1)
  fullName: string;

  @IsOptional()
  @IsUrl()
  avatarUrl: string;
}
