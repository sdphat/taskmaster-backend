import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CardLabelService } from './card-label.service';
import { CreateCardLabelDto } from './dto/create-card-label.dto';
import { UpdateCardLabelDto } from './dto/update-card-label.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(RolesGuard)
@Controller('card-label')
export class CardLabelController {
  constructor(private readonly cardLabelService: CardLabelService) {}

  @Roles(['ADMIN', 'COLLABORATOR'])
  @Post()
  create(@Body() createCardLabelDto: CreateCardLabelDto) {
    return this.cardLabelService.create(createCardLabelDto);
  }

  @Roles(['ADMIN', 'COLLABORATOR'])
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCardLabelDto: UpdateCardLabelDto,
  ) {
    return this.cardLabelService.update({ id: +id, ...updateCardLabelDto });
  }

  @Roles(['ADMIN', 'COLLABORATOR'])
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cardLabelService.remove(+id);
  }
}
