import { Test, TestingModule } from '@nestjs/testing';
import { Users } from './users';

describe('Users', () => {
  let provider: Users;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Users],
    }).compile();

    provider = module.get<Users>(Users);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
