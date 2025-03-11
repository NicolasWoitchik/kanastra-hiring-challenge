import { Inject, NotAcceptableException } from '@nestjs/common';
import { IUploadedFileUseCase } from './uploaded-file.interface';
import { GenericResponseDto } from '@shared/dtos/generic-response.dto';
import { ConfigService } from '@nestjs/config';
import { UploadedFileRequestDTO } from './dtos/request.dto';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { FILE_TOPIC_EXCHANGE } from '@modules/messaging/constants';
import { ProcessUploadedFileDTO } from '@modules/messaging/usecases/process-uploaded-file/dtos/process-uploaded-file.dto';
import { generateUUID } from '@modules/upload/utils/generate-uuid.util';

export class UploadedFileUseCase implements IUploadedFileUseCase {
  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
    @Inject(AmqpConnection) private readonly amqpConnection: AmqpConnection,
  ) {}
  async execute(
    file?: UploadedFileRequestDTO,
  ): Promise<GenericResponseDto<string>> {
    if (!file) throw new NotAcceptableException('Content Type not accepted');

    const processId = generateUUID().replace(/-/g, '');

    await this.amqpConnection.publish(
      this.configService.get(FILE_TOPIC_EXCHANGE),
      'file.uploaded',
      new ProcessUploadedFileDTO(
        file.bucket,
        file.key,
        file.mimetype,
        processId,
      ),
    );

    return {
      message: `Arquivo recebido com sucesso. Referencia do processamento: ${processId}. Aguarde a conclusão da operação.`,
    };
  }
}
