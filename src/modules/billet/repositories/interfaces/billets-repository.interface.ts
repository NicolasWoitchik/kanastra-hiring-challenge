import { BilletEntity } from '../../entities/billet.entity';

export interface IBilletsRepository {
  findById(id: string): Promise<BilletEntity>;
  createBulk(items: BilletEntity[]): Promise<BilletEntity[]>;
  update(billet: BilletEntity): Promise<void>;
  findAllPendingByDebtDueDate(
    date: string,
    offset?: number,
  ): Promise<BilletEntity[]>;
}
