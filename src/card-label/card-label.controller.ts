import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { CardLabelService } from './card-label.service';
import { CreateCardLabelDto } from './dto/create-card-label.dto';
import { UpdateCardLabelDto } from './dto/update-card-label.dto';

@Controller('card-label')
export class CardLabelController {
  constructor(private readonly cardLabelService: CardLabelService) {}

  @Post()
  create(@Body() createCardLabelDto: CreateCardLabelDto) {
    return this.cardLabelService.create(createCardLabelDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCardLabelDto: UpdateCardLabelDto,
  ) {
    return this.cardLabelService.update({ id: +id, ...updateCardLabelDto });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cardLabelService.remove(+id);
  }
}
