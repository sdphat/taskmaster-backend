import { Test, TestingModule } from '@nestjs/testing';
import { BoardCardController } from './board-card.controller';

describe('BoardCardController', () => {
  let controller: BoardCardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BoardCardController],
    }).compile();

    controller = module.get<BoardCardController>(BoardCardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
