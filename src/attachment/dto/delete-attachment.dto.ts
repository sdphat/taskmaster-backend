import { IsUrl } from 'class-validator';

export class DeleteAttachmentDto {
  @IsUrl()
  url: string;
}
