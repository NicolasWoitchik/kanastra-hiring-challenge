import { ProcessGroupUploadedFileDTO } from './dtos/process-group-uploaded-file.dto';

export interface IProcessGroupUploadedFileUseCase {
  execute(dto: ProcessGroupUploadedFileDTO, msg?: unknown): Promise<void>;
}
