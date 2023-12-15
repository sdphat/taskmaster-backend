import { PickType } from '@nestjs/mapped-types';
import { CardLabelDto } from './card-label.dto';

export class CreateCardLabelDto extends PickType(CardLabelDto, [
  'color',
  'name',
  'boardId',
]) {}
