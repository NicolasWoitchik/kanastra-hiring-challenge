import { Module } from '@nestjs/common';
import { HealthController } from './controllers/health.controller';
import { GetHealthCheckUseCase } from './usecases/get-health-check.usecase/get-health-check.usecase';
import { GET_HEALTH_CHECK } from './constants';

@Module({
  controllers: [HealthController],
  providers: [
    {
      provide: GET_HEALTH_CHECK,
      useClass: GetHealthCheckUseCase,
    },
  ],
})
export class HealthModule {}
