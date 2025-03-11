import { UserEntity } from '@modules/user/entities/user.entity';

export interface ICreateBulkUsersUseCase {
  execute(items: Partial<UserEntity>[]): Promise<UserEntity[]>;
}
