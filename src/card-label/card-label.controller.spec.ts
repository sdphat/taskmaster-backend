import { Test, TestingModule } from '@nestjs/testing';
import { CardLabelController } from './card-label.controller';
import { CardLabelService } from './card-label.service';

describe('CardLabelController', () => {
  let controller: CardLabelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardLabelController],
      providers: [CardLabelService],
    }).compile();

    controller = module.get<CardLabelController>(CardLabelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
