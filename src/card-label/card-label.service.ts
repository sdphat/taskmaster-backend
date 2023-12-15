import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateCardLabelDto } from './dto/create-card-label.dto';
import { UpdateCardLabelDto } from './dto/update-card-label.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CardLabelService {
  constructor(private prismaService: PrismaService) {}

  async create(createCardLabelDto: CreateCardLabelDto) {
    try {
      return await this.prismaService.boardLabel.create({
        data: createCardLabelDto,
      });
    } catch (err) {
      throw new ForbiddenException();
    }
  }

  async update({ id, ...updateData }: UpdateCardLabelDto & { id: number }) {
    try {
      return await this.prismaService.boardLabel.update({
        data: updateData,
        where: {
          id,
        },
      });
    } catch (err) {
      throw new ForbiddenException();
    }
  }

  remove(id: number) {
    return this.prismaService.boardLabel.delete({ where: { id } });
  }
}
