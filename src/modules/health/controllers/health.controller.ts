import { Controller, Get, Inject } from '@nestjs/common';
import { GET_HEALTH_CHECK } from '../constants';
import { IGetHealthCheckUseCase } from '../usecases/get-health-check.usecase/get-health-check.interface';

@Controller('health')
export class HealthController {
  constructor(
    @Inject(GET_HEALTH_CHECK)
    private readonly getHealthCheckUseCase: IGetHealthCheckUseCase,
  ) {}

  @Get()
  async health() {
    const result = await this.getHealthCheckUseCase.execute();
    return result;
  }
}
