import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import { extractPublicId, setConfig } from 'cloudinary-build-url';

@Injectable()
export class AttachmentService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: configService.getOrThrow<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: configService.getOrThrow<string>('CLOUDINARY_API_KEY'),
      api_secret: configService.getOrThrow<string>('CLOUDINARY_API_SECRET'),
    });
    setConfig({
      cloudName: configService.getOrThrow<string>('CLOUDINARY_CLOUD_NAME'),
      apiKey: configService.getOrThrow<string>('CLOUDINARY_API_KEY'),
      apiSecret: configService.getOrThrow<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async create(file: Express.Multer.File): Promise<{ url: string }> {
    const uploadResult: UploadApiResponse = await new Promise((resolve) => {
      cloudinary.uploader
        .upload_stream((error, uploadResult) => {
          return resolve(uploadResult);
        })
        .end(file.buffer);
    });
    return { url: uploadResult.url };
  }

  async remove(url: string) {
    const id = extractPublicId(url);
    const response: { result: string } = await cloudinary.uploader.destroy(id);
    if (response.result !== 'ok') {
      throw new ForbiddenException();
    }
  }
}
