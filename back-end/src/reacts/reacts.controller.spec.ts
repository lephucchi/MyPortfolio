import { Test, TestingModule } from '@nestjs/testing';
import { ReactionController } from './reacts.controller';
import { ReactionService } from './reacts.service';

describe('ReactsController', () => {
  let controller: ReactionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReactionController],
      providers: [ReactionService],
    }).compile();

    controller = module.get<ReactionController>(ReactionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
