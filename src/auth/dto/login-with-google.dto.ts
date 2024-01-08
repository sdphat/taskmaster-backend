import { IsString } from 'class-validator';

export class LoginWithGoogleDto {
  @IsString()
  code: string;
}
