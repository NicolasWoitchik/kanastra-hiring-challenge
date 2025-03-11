import { ProcessBilletCheckPendingRequestDTO } from './dtos/process-billet-check-pending-request.dto';

export interface IProcessBilletCheckPendingUseCase {
  execute(dto: ProcessBilletCheckPendingRequestDTO): Promise<void>;
}
