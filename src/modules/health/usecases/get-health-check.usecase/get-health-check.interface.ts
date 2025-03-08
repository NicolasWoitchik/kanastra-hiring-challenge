import { ResponseHealthCheckDto } from './response-health-check.dto';

export interface IGetHealthCheckUseCase {
  execute(): Promise<ResponseHealthCheckDto>;
}
