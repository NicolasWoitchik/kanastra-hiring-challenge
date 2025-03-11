import { BilletEntity } from '@modules/billet/entities/billet.entity';

export interface IProcessBilletPaymentUseCase {
  execute(dto: BilletEntity): Promise<void>;
}
