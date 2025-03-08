import { IGetHealthCheckUseCase } from './get-health-check.interface';
import { ResponseHealthCheckDto } from './response-health-check.dto';

export class GetHealthCheckUseCase implements IGetHealthCheckUseCase {
  async execute(): Promise<ResponseHealthCheckDto> {
    return new ResponseHealthCheckDto('Everthing is ok!');
  }
}
