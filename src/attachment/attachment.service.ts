import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import { extractPublicId, setConfig } from 'cloudinary-build-url';
import { PrismaService } from '../prisma.service';

export interface CreateAttachmentReturn {
  url: string;
  type: string;
  name: string;
}

@Injectable()
export class AttachmentService {
  constructor(
    private configService: ConfigService,
    private prismaService: PrismaService,
  ) {
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

  async create(file: Express.Multer.File): Promise<CreateAttachmentReturn> {
    const uploadResult: UploadApiResponse = await new Promise((resolve) => {
      cloudinary.uploader
        .upload_stream((error, uploadResult) => {
          return resolve(uploadResult);
        })
        .end(file.buffer);
    });
    await this.prismaService.attachment.create({
      data: {
        url: uploadResult.url,
        type: uploadResult.resource_type,
        name: file.originalname,
      },
    });
    return {
      url: uploadResult.url,
      type: uploadResult.resource_type,
      name: file.originalname,
    };
  }

  async remove(url: string) {
    const id = extractPublicId(url);
    const response: { result: string } = await cloudinary.uploader.destroy(id);
    if (response.result !== 'ok') {
      throw new ForbiddenException();
    }
    await this.prismaService.attachment.delete({
      where: {
        url,
      },
    });
  }
}
