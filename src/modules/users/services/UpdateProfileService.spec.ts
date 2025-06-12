import AppError from "@shared/errors/AppError";
import FakeUsersRepositories from "@modules/users/infra/database/repositories/Fakes/FakeUsersRepositories";
import UpdateProfileService from "./UpdateProfileService";
import { compare, hash } from "bcrypt";

jest.mock("bcrypt");

describe('UpdateProfileService', () => {
  let fakeUsersRepositories: FakeUsersRepositories;
  let updateProfileService: UpdateProfileService;

  beforeEach(() => {
    fakeUsersRepositories = new FakeUsersRepositories();
    updateProfileService = new UpdateProfileService(fakeUsersRepositories);
  });

  it('Deve atualizar o perfil do usuário com sucesso', async () => {
    const user = await fakeUsersRepositories.create({
      name: 'Usuário Teste',
      email: 'usuario.teste@example.com',
      password: 'hashed-password',
    });

    jest.spyOn(fakeUsersRepositories, 'findByEmail').mockResolvedValue(null);
    (compare as jest.Mock).mockResolvedValue(true);
    (hash as jest.Mock).mockImplementation(async (_password: string) => {
      user.password = 'new-hashed-password';
      return user.password;
    });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'Usuário Atualizado',
      email: 'usuario.atualizado@example.com',
      password: 'newpassword',
      old_password: '123456',
    });

    expect(updatedUser.name).toBe('Usuário Atualizado');
    expect(updatedUser.email).toBe('usuario.atualizado@example.com');
    expect(updatedUser.password).toBe('new-hashed-password');
  });

  it('Deve lançar erro se usuário não for encontrado', async () => {
    await expect(
      updateProfileService.execute({
        user_id: 999,
        name: 'Nome',
        email: 'email@example.com',
        password: '',
        old_password: '',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Deve lançar erro se email já estiver em uso', async () => {
    const user = await fakeUsersRepositories.create({
      name: 'Usuário Teste',
      email: 'usuario.teste@example.com',
      password: 'hashed-password',
    });

    jest.spyOn(fakeUsersRepositories, 'findByEmail').mockResolvedValue(user);

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        email: 'usuario.teste@example.com',
        name: '',
        password: '',
        old_password: '',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Deve lançar erro se tentar alterar senha sem informar a senha antiga', async () => {
    const user = await fakeUsersRepositories.create({
      name: 'Usuário Teste',
      email: 'usuario.teste@example.com',
      password: 'hashed-password',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        password: 'newpassword',
        name: '',
        email: '',
        old_password: '',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Deve lançar erro se a senha antiga estiver incorreta', async () => {
    const user = await fakeUsersRepositories.create({
      name: 'Usuário Teste',
      email: 'usuario.teste@example.com',
      password: 'hashed-password',
    });

    (compare as jest.Mock).mockImplementation(async () => false);

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        password: 'newpassword',
        old_password: 'wrongpassword',
        name: '',
        email: '',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
