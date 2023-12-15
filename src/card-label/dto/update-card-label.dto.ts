import { IntersectionType, OmitType, PartialType } from '@nestjs/mapped-types';
import { CardLabelDto } from './card-label.dto';

/**
 * label id is required and other fields are optional
 */
export class UpdateCardLabelDto extends IntersectionType(
  PartialType(OmitType(CardLabelDto, ['id', 'boardId'])),
) {}
