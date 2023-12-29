import { Test, TestingModule } from '@nestjs/testing';
import { InvitationCodeGeneratorService } from './invitation-code-generator.service';

describe('InvitationCodeGeneratorService', () => {
  let service: InvitationCodeGeneratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InvitationCodeGeneratorService],
    }).compile();

    service = module.get<InvitationCodeGeneratorService>(InvitationCodeGeneratorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
