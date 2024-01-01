import {
  Body,
  Controller,
  Delete,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AttachmentService } from './attachment.service';
import { DeleteAttachmentDto } from './dto/delete-attachment.dto';

@Controller('attachment')
export class AttachmentController {
  constructor(private readonly attachmentService: AttachmentService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({
          maxSize: +process.env['MAX_UPLOAD_FILE_BYTE_SIZE'],
        })
        .build(),
    )
    file: Express.Multer.File,
  ) {
    return this.attachmentService.create(file);
  }

  @Delete()
  remove(@Body() { url }: DeleteAttachmentDto) {
    return this.attachmentService.remove(url);
  }
}
