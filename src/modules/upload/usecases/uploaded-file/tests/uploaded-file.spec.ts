import { Test } from '@nestjs/testing';
import { UploadedFileUseCase } from '../uploaded-file.usecase';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { ConfigModule } from '@nestjs/config';
import { NotAcceptableException } from '@nestjs/common';
import { UploadedFileRequestDTO } from '../dtos/request.dto';

describe('UploadedFile Test suite', () => {
  let useCase: UploadedFileUseCase;
  let amqpConnection: AmqpConnection;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        UploadedFileUseCase,
        {
          provide: AmqpConnection,
          useValue: {
            publish: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<UploadedFileUseCase>(UploadedFileUseCase);
    amqpConnection = module.get<AmqpConnection>(AmqpConnection);
  });

  it('should not be able to upload a file with invalid content type', () => {
    const result = useCase.execute(null);
    expect(result).rejects.toThrow(NotAcceptableException);
  });

  it('should be able to upload a file', async () => {
    const file = new UploadedFileRequestDTO();
    const result = await useCase.execute(file);

    expect(amqpConnection.publish).toHaveBeenCalledTimes(1);

    expect(result.message.includes('Arquivo recebido com sucesso.')).toBeTruthy;
  });
});
