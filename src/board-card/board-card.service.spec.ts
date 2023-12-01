import { Test, TestingModule } from '@nestjs/testing';
import { BoardCardService } from './board-card.service';

describe('BoardCardService', () => {
  let service: BoardCardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BoardCardService],
    }).compile();

    service = module.get<BoardCardService>(BoardCardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
