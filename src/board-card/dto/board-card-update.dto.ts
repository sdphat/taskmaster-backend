import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Validate,
  ValidateNested,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  isHexColor,
  isRgbColor,
} from 'class-validator';
import { Label } from '../../types/board';
import { BoardCardUpdateData } from '../board-card.service';

@ValidatorConstraint({ name: 'isColor' })
class IsColor implements ValidatorConstraintInterface {
  validate(
    value: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    validationArguments?: ValidationArguments,
  ): boolean | Promise<boolean> {
    return isHexColor(value) || isRgbColor(value);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage?(validationArguments?: ValidationArguments): string {
    return `($value) is not a color`;
  }
}

class LabelDto implements Pick<Label, 'color' | 'name'> {
  @Validate(IsColor)
  color: string;

  @IsString()
  name: string;
}

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
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LabelDto)
  labels?: Pick<Label, 'color' | 'name'>[];
}
