import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';

describe('EmailController', () => {
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailService],
    }).compile();
  });

  it('should be defined', () => {});
});
