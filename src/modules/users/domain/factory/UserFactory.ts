import FakeUsersRepositories from "@modules/users/infra/database/repositories/Fakes/FakeUsersRepositories";
import { IUsersRepositories } from "@modules/users/domain/repositories/IUsersRepositories";

interface UserData {
  name: string;
  email: string;
  password: string;
}

export function makeFakeUser(overrides?: Partial<UserData>): UserData {
  return {
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    password: 'password123',
    ...overrides,
  };
}

export function makeFakeUserRepository(): IUsersRepositories {
  return new FakeUsersRepositories();
}
