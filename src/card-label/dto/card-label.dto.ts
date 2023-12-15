import { Validate, IsString, IsInt } from 'class-validator';
import { Label } from '../../types/board';
import { IsColor } from '../../validator/IsColor';

export class CardLabelDto implements Pick<Label, 'id' | 'color' | 'name'> {
  @IsInt()
  id: number;

  @IsInt()
  boardId: number;

  @Validate(IsColor)
  color: string;

  @IsString()
  name: string;
}
