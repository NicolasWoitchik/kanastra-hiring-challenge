import { Test } from '@nestjs/testing';
import { ProcessUploadedFileUseCase } from '../process-uploaded-file.usecase';
import { ConfigModule } from '@nestjs/config';
import { S3_CLIENT } from '@shared/storage/constants';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

describe('ProcessUploadedFileUseCase Test suite', () => {
  let useCase: ProcessUploadedFileUseCase;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        ProcessUploadedFileUseCase,
        {
          provide: S3_CLIENT,
          useValue: jest.fn(),
        },
        {
          provide: AmqpConnection,
          useValue: jest.fn(),
        },
      ],
    }).compile();

    useCase = module.get<ProcessUploadedFileUseCase>(
      ProcessUploadedFileUseCase,
    );
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });
});
