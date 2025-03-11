import { ProcessGroupUploadedFileItemDTO } from './process-group-uploaded-file-item.dto';

export class ProcessGroupUploadedFileDTO {
  constructor(
    readonly items: ProcessGroupUploadedFileItemDTO[],
    readonly groupId: string,
    readonly processId: string,
  ) {}
}
