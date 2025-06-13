import AppError from "@shared/errors/AppError";
import { makeFakeUser, makeFakeUserRepository } from "@modules/users/domain/factory/UserFactory";
import SessionUserService from "./SessionUserService";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import RedisCache from "@shared/cache/RedisCache";

jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("@shared/cache/RedisCache");

describe('SessionUserService', () => {
  let fakeUsersRepositories: ReturnType<typeof makeFakeUserRepository>;
  let sessionUserService: SessionUserService;
  let redisCacheMock: jest.Mocked<RedisCache>;

  beforeEach(() => {
    fakeUsersRepositories = makeFakeUserRepository();
    sessionUserService = new SessionUserService(fakeUsersRepositories);
    redisCacheMock = new RedisCache() as jest.Mocked<RedisCache>;
  });

  it('Deve autenticar usuário com sucesso e retornar token', async () => {
    const userData = makeFakeUser({ name: 'Usuário Teste', email: 'usuario.teste@example.com', password: 'hashed-password' });
    const user = await fakeUsersRepositories.create(userData);

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
    const userData = makeFakeUser({ name: 'Usuário Teste', email: 'usuario.teste@example.com', password: 'hashed-password' });
    const user = await fakeUsersRepositories.create(userData);

    (compare as jest.Mock).mockResolvedValue(false);

    await expect(
      sessionUserService.execute({ email: user.email, password: 'senhaerrada' })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Deve lidar com falha na invalidação do cache Redis sem falhar', async () => {
    const userData = makeFakeUser({ name: 'Usuário Teste', email: 'usuario.teste@example.com', password: 'hashed-password' });
    const user = await fakeUsersRepositories.create(userData);

    (compare as jest.Mock).mockResolvedValue(true);
    (sign as jest.Mock).mockReturnValue('jwt-token');
    redisCacheMock.invalidate.mockRejectedValue(new Error('Redis error'));

    const response = await sessionUserService.execute({
      email: user.email,
      password: '123456',
    });

    expect(response).toHaveProperty('token', 'jwt-token');
    expect(response).toHaveProperty('user');
    expect(response.user.email).toBe(user.email);
  });

  it('Deve gerar token com o payload correto e expiração', async () => {
    const userData = makeFakeUser({ name: 'Usuário Teste', email: 'usuario.teste@example.com', password: 'hashed-password' });
    const user = await fakeUsersRepositories.create(userData);

    (compare as jest.Mock).mockResolvedValue(true);
    const signMock = sign as jest.Mock;
    signMock.mockReturnValue('jwt-token');
    redisCacheMock.invalidate.mockResolvedValue();

    await sessionUserService.execute({
      email: user.email,
      password: '123456',
    });

    expect(signMock).toHaveBeenCalledWith(
      {},
      expect.any(String),
      expect.objectContaining({
        subject: String(user.id),
        expiresIn: "1d",
      })
    );
  });
});
