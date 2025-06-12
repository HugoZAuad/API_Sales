import AppError from "@shared/errors/AppError";
import FakeUsersRepositories from "@modules/users/infra/database/repositories/Fakes/FakeUsersRepositories";
import CreateUserService from "./CreateUserService";

describe('CreateUserService', () => {
  it('Deve criar um novo usuário com sucesso', async () => {
    const fakeUsersRepositories = new FakeUsersRepositories();
    const createUser = new CreateUserService(fakeUsersRepositories);

    const user = await createUser.execute({
      name: 'Usuário Teste',
      email: 'usuario.teste@example.com',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
    expect(user.email).toBe('usuario.teste@example.com');
  });

  it('Não deve permitir criar usuário com email já em uso', async () => {
    const fakeUsersRepositories = new FakeUsersRepositories();
    const createUser = new CreateUserService(fakeUsersRepositories);

    await createUser.execute({
      name: 'Usuário Teste',
      email: 'usuario.teste@example.com',
      password: '123456',
    });

    await expect(
      createUser.execute({
        name: 'Outro Usuário',
        email: 'usuario.teste@example.com',
        password: '654321',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
