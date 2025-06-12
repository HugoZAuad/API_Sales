import AppError from "@shared/errors/AppError";
import FakeUsersRepositories from "@modules/users/infra/database/repositories/Fakes/FakeUsersRepositories";
import SessionUserService from "./SessionUserService";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import RedisCache from "@shared/cache/RedisCache";

jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("@shared/cache/RedisCache");

describe('SessionUserService', () => {
  let fakeUsersRepositories: FakeUsersRepositories;
  let sessionUserService: SessionUserService;
  let redisCacheMock: jest.Mocked<RedisCache>;

  beforeEach(() => {
    fakeUsersRepositories = new FakeUsersRepositories();
    sessionUserService = new SessionUserService(fakeUsersRepositories);
    redisCacheMock = new RedisCache() as jest.Mocked<RedisCache>;
  });

  it('Deve autenticar usuário com sucesso e retornar token', async () => {
    const user = await fakeUsersRepositories.create({
      name: 'Usuário Teste',
      email: 'usuario.teste@example.com',
      password: 'hashed-password',
    });

    (compare as jest.Mock).mockResolvedValue(true);
    (sign as jest.Mock).mockReturnValue('jwt-token');
    redisCacheMock.invalidate.mockResolvedValue();

    const response = await sessionUserService.execute({
      email: user.email,
      password: '123456',
    });

    expect(response).toHaveProperty('token', 'jwt-token');
    expect(response).toHaveProperty('user');
    expect(response.user.email).toBe(user.email);
  });

  it('Deve lançar erro se usuário não for encontrado', async () => {
    await expect(
      sessionUserService.execute({ email: 'naoexiste@example.com', password: '123456' })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Deve lançar erro se senha estiver incorreta', async () => {
    const user = await fakeUsersRepositories.create({
      name: 'Usuário Teste',
      email: 'usuario.teste@example.com',
      password: 'hashed-password',
    });

    (compare as jest.Mock).mockResolvedValue(false);

    await expect(
      sessionUserService.execute({ email: user.email, password: 'senhaerrada' })
    ).rejects.toBeInstanceOf(AppError);
  });
});
