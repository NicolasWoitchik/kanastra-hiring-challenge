import { IGetHealthCheckUseCase } from '../../get-health-check.interface';
import { GetHealthCheckUseCase } from '../../get-health-check.usecase';

let getHealthCheckUseCase: IGetHealthCheckUseCase;
describe('GetHealthCheckUseCase', () => {
  beforeAll(() => {
    getHealthCheckUseCase = new GetHealthCheckUseCase();
  });
  it('should be defined', async () => {
    const result = await getHealthCheckUseCase.execute();

    expect(result).toEqual({
      message: 'Everthing is ok!',
    });
  });
});
