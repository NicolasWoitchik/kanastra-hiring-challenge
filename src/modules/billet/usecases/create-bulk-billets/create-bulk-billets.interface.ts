import { BilletEntity } from '@modules/billet/entities/billet.entity';

export interface ICreateBulkBilletsUseCase {
  execute(items: Partial<BilletEntity>[]): Promise<void>;
}
