import { UserEntity } from '@modules/user/entities/user.entity';

export interface IUsersRepository {
  createBulk(items: UserEntity[]): Promise<UserEntity[]>;
  findByEmails(emails: string[]): Promise<UserEntity[]>;
}
