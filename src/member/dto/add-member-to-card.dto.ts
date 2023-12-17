import { IsInt } from 'class-validator';

export class AddMemberToCardDto {
  @IsInt()
  cardId: number;
  @IsInt()
  memberId: number;
}
