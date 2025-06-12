import AppError from "@shared/errors/AppError";
import ResetPasswordService from "./ResetPasswordService";
import FakeUsersRepositories from "@modules/users/infra/database/repositories/Fakes/FakeUsersRepositories";
import { userTokensRepositories } from "../infra/database/repositories/UserTokensRepositories";
import { hash } from "bcrypt";
jest.mock("../infra/database/repositories/UserTokensRepositories");
jest.mock("bcrypt");

describe('ResetPasswordService', () => {
  let fakeUsersRepositories: FakeUsersRepositories;
  let resetPasswordService: ResetPasswordService;

  beforeEach(() => {
    fakeUsersRepositories = new FakeUsersRepositories();
    resetPasswordService = new ResetPasswordService(fakeUsersRepositories);
  });

  it('Deve resetar a senha com sucesso', async () => {
    const user = await fakeUsersRepositories.create({
      name: 'Usuário Teste',
      email: 'usuario.teste@example.com',
      password: '123456',
    });

    const token = 'valid-token';
    const userToken = {
      user_id: user.id,
      token,
      created_at: new Date(),
    };

    (userTokensRepositories.findByToken as jest.Mock).mockResolvedValue(userToken);
    (hash as jest.Mock).mockResolvedValue('hashed-password');
    const saveSpy = jest.spyOn(fakeUsersRepositories, 'save');

    await resetPasswordService.execute({ token, password: 'newpassword' });

    expect(user.password).toBe('hashed-password');
    expect(saveSpy).toHaveBeenCalledWith(user);
  });

  it('Deve lançar erro se token não existir', async () => {
    (userTokensRepositories.findByToken as jest.Mock).mockResolvedValue(null);

    await expect(
      resetPasswordService.execute({ token: 'invalid-token', password: 'newpassword' })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Deve lançar erro se usuário não existir', async () => {
    const userToken = {
      user_id: 999,
      token: 'valid-token',
      created_at: new Date(),
    };

    (userTokensRepositories.findByToken as jest.Mock).mockResolvedValue(userToken);
    jest.spyOn(fakeUsersRepositories, 'findById').mockResolvedValue(null);

    await expect(
      resetPasswordService.execute({ token: 'valid-token', password: 'newpassword' })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Deve lançar erro se token estiver expirado', async () => {
    const user = await fakeUsersRepositories.create({
      name: 'Usuário Teste',
      email: 'usuario.teste@example.com',
      password: '123456',
    });

    const pastDate = new Date(Date.now() - 3 * 60 * 60 * 1000); 
    const userToken = {
      user_id: user.id,
      token: 'valid-token',
      created_at: pastDate,
    };

    (userTokensRepositories.findByToken as jest.Mock).mockResolvedValue(userToken);

    await expect(
      resetPasswordService.execute({ token: 'valid-token', password: 'newpassword' })
    ).rejects.toBeInstanceOf(AppError);
  });
});
