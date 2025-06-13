jest.mock('app-root-path', () => ({
  path: '/tmp',
}));

import AppError from "@shared/errors/AppError";
import { makeFakeUser, makeFakeUserRepository } from "@modules/users/domain/factory/UserFactory";
import UpdateUserAvatarService from "./UpdateUserAvatarService";
import fs from "fs";
import path from "path";
import uploadConfig from "@config/Upload";
import RedisCache from "@shared/cache/RedisCache";

jest.mock("path");
jest.mock("@config/Upload");
jest.mock("@shared/cache/RedisCache");

describe('UpdateUserAvatarService', () => {
  let fakeUsersRepositories: ReturnType<typeof makeFakeUserRepository>;
  let updateUserAvatarService: UpdateUserAvatarService;
  let redisCacheMock: jest.Mocked<RedisCache>;

  beforeEach(() => {
    fakeUsersRepositories = makeFakeUserRepository();
    updateUserAvatarService = new UpdateUserAvatarService(fakeUsersRepositories);
    redisCacheMock = new RedisCache() as jest.Mocked<RedisCache>;

    Object.defineProperty(uploadConfig, 'directory', {
      get: jest.fn(() => '/tmp/uploads'),
    });
    (path.join as jest.Mock).mockImplementation((..._args) => '/tmp/uploads/old-avatar.jpg');

    if (!fs.promises) {
      (fs as unknown as { promises: Record<string, unknown> }).promises = {};
    }
    const mockStats = {
      isFile: () => true,
      isDirectory: () => false,
    };
    (fs.promises.stat as jest.Mock) = jest.fn().mockResolvedValue(mockStats);
    (fs.promises.unlink as jest.Mock) = jest.fn().mockResolvedValue(undefined);

    redisCacheMock.invalidate.mockResolvedValue();
  });

  it('Deve atualizar o avatar do usuário e remover o avatar antigo', async () => {
    const userData = makeFakeUser({ name: 'Usuário Teste', email: 'usuario.teste@example.com', password: '123456' });
    const user = await fakeUsersRepositories.create(userData);

    user.avatar = 'old-avatar.jpg';

    const saveSpy = jest.spyOn(fakeUsersRepositories, 'save');

    const updatedUser = await updateUserAvatarService.execute({
      userId: user.id,
      avatarFileName: 'new-avatar.jpg',
    });

    expect(fs.promises.stat).toHaveBeenCalledWith('/tmp/uploads/old-avatar.jpg');
    expect(fs.promises.unlink).toHaveBeenCalledWith('/tmp/uploads/old-avatar.jpg');
    expect(saveSpy).toHaveBeenCalledWith(updatedUser);
    expect(updatedUser.avatar).toBe('new-avatar.jpg');
  });

  it('Deve lançar erro se usuário não for encontrado', async () => {
    await expect(
      updateUserAvatarService.execute({
        userId: 999,
        avatarFileName: 'avatar.jpg',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
