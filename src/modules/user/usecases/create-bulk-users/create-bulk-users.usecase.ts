import { Inject, Injectable } from '@nestjs/common';
import { ICreateBulkUsersUseCase } from './create-bulk-users.interface';
import { UserEntity } from '@modules/user/entities/user.entity';
import { IUsersRepository } from '@modules/user/repositories/interfaces/users-repository.interface';
import { USERS_REPOSITORY } from '@modules/user/constants';

@Injectable()
export class CreateBulkUsersUseCase implements ICreateBulkUsersUseCase {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: IUsersRepository,
  ) {}
  async execute(items: Partial<UserEntity>[]): Promise<UserEntity[]> {
    const usersEmailsSerialized = items
      .map((item) => item.email?.toLowerCase())
      .filter((email) => email);

    const alreadyExists = await this.usersRepository.findByEmails(
      usersEmailsSerialized,
    );

    if (alreadyExists.length === usersEmailsSerialized.length)
      return this.usersRepository.findByEmails(usersEmailsSerialized);

    const alreadyExistsEmailsSet = new Set(
      alreadyExists.map((user) => user.email),
    );

    const usersToCreate: UserEntity[] = items
      .filter((item) => !alreadyExistsEmailsSet.has(item.email))
      .map((item) => ({
        id: undefined,
        name: item.name,
        email: item.email.toLowerCase(),
        governmentId: item.governmentId,
        created_at: new Date(),
        updated_at: new Date(),
      }));

    if (!usersToCreate.length)
      return this.usersRepository.findByEmails(usersEmailsSerialized);

    await this.usersRepository.createBulk(usersToCreate);

    return this.usersRepository.findByEmails(usersEmailsSerialized);
  }
}
