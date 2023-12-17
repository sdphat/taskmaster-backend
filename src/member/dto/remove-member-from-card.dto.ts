import { IsInt } from 'class-validator';

export class RemoveMemberFromCardDto {
  @IsInt()
  cardId: number;
  @IsInt()
  memberId: number;
}
