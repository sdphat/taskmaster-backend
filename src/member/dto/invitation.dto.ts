import { IsString } from 'class-validator';

export class InvitationDto {
  @IsString()
  code: string;
}
