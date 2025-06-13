import AppError from "@shared/errors/AppError";
import { makeFakeUser, makeFakeUserRepository } from "@modules/users/domain/factory/UserFactory";
import ShowProfileService from "./ShowProfileService";

describe('ShowProfileService', () => {
  let fakeUsersRepositories: ReturnType<typeof makeFakeUserRepository>;
  let showProfileService: ShowProfileService;

  beforeEach(() => {
    fakeUsersRepositories = makeFakeUserRepository();
    showProfileService = new ShowProfileService(fakeUsersRepositories);
  });

  it('Deve retornar o perfil do usuário existente', async () => {
    const userData = makeFakeUser({ name: 'Usuário Teste', email: 'usuario.teste@example.com', password: '123456' });
    const user = await fakeUsersRepositories.create(userData);

    const foundUser = await showProfileService.execute({ user_id: user.id });

    expect(foundUser).toHaveProperty('id', user.id);
  });

  it('Deve lançar erro se o usuário não for encontrado', async () => {
    await expect(showProfileService.execute({ user_id: 999 })).rejects.toBeInstanceOf(AppError);
  });
});
