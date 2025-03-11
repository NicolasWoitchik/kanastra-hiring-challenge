import { GenericResponseDto } from '@shared/dtos/generic-response.dto';
import { UploadedFileRequestDTO } from './dtos/request.dto';

export interface IUploadedFileUseCase {
  execute(file: UploadedFileRequestDTO): Promise<GenericResponseDto<string>>;
}
