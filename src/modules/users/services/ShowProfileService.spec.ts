import AppError from "@shared/errors/AppError";
import FakeUsersRepositories from "@modules/users/infra/database/repositories/Fakes/FakeUsersRepositories";
import ShowProfileService from "./ShowProfileService";

describe('ShowProfileService', () => {
  let fakeUsersRepositories: FakeUsersRepositories;
  let showProfileService: ShowProfileService;

  beforeEach(() => {
    fakeUsersRepositories = new FakeUsersRepositories();
    showProfileService = new ShowProfileService(fakeUsersRepositories);
  });

  it('Deve retornar o perfil do usuário existente', async () => {
    const user = await fakeUsersRepositories.create({
      name: 'Usuário Teste',
      email: 'usuario.teste@example.com',
      password: '123456',
    });

    const foundUser = await showProfileService.execute({ user_id: user.id });

    expect(foundUser).toHaveProperty('id', user.id);
  });

  it('Deve lançar erro se o usuário não for encontrado', async () => {
    await expect(showProfileService.execute({ user_id: 999 })).rejects.toBeInstanceOf(AppError);
  });
});
