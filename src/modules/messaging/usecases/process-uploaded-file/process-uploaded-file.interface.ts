import { ProcessUploadedFileDTO } from './dtos/process-uploaded-file.dto';

export interface IProcessUploadedFileUseCase {
  execute(dto: ProcessUploadedFileDTO): Promise<void>;
}
