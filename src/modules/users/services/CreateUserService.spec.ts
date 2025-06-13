import AppError from "@shared/errors/AppError";
import { makeFakeUser, makeFakeUserRepository } from "@modules/users/domain/factory/UserFactory";
import CreateUserService from "./CreateUserService";
import bcrypt from 'bcrypt';
import { IUsersRepositories } from "@modules/users/domain/repositories/IUsersRepositories";

describe('CreateUserService', () => {
  let fakeUsersRepositories: IUsersRepositories;
  let createUser: CreateUserService;

  beforeEach(() => {
    fakeUsersRepositories = makeFakeUserRepository();
    createUser = new CreateUserService(fakeUsersRepositories);
  });

  it('Deve criar um novo usuário com sucesso', async () => {
    const userData = makeFakeUser({ email: 'unique.user@example.com' });

    const user = await createUser.execute(userData);

    expect(user).toHaveProperty('id');
    expect(user.email).toBe(userData.email);
  });

  it('Não deve permitir criar usuário com email já em uso', async () => {
    const userData = makeFakeUser({ email: 'duplicate.user@example.com' });

    await createUser.execute(userData);

    await expect(
      createUser.execute(userData)
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Deve criptografar a senha do usuário com bcrypt', async () => {
    const hashSpy = jest.spyOn(bcrypt, 'hash').mockImplementation(() => Promise.resolve('hashed-password'));

    const user = await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(hashSpy).toHaveBeenCalledWith('123456', 10);
    expect(user.password).toBe('hashed-password');

    hashSpy.mockRestore();
  });
});
