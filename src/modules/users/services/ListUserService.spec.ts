import FakeUsersRepositories from "@modules/users/infra/database/repositories/Fakes/FakeUsersRepositories";
import ListUserService from "./LiserUserService";
import RedisCache from "@shared/cache/RedisCache";

jest.mock("@shared/cache/RedisCache");

describe('ListUserService', () => {
  let fakeUsersRepositories: FakeUsersRepositories;
  let listUserService: ListUserService;
  let redisCacheMock: jest.Mocked<RedisCache>;

  beforeEach(() => {
    fakeUsersRepositories = new FakeUsersRepositories();
    listUserService = new ListUserService(fakeUsersRepositories);
    redisCacheMock = new RedisCache() as jest.Mocked<RedisCache>;
  });

  it('Deve retornar a lista paginada de usuários', async () => {
    redisCacheMock.recover.mockResolvedValue(null);
    redisCacheMock.save.mockResolvedValue();

    await fakeUsersRepositories.create({ name: 'Usuário 1', email: 'user1@example.com', password: '123456' });
    await fakeUsersRepositories.create({ name: 'Usuário 2', email: 'user2@example.com', password: '123456' });

    const result = await listUserService.execute(1, 10);

    expect(result).toHaveProperty('data');
    expect(result.data).toHaveLength(2);
    expect(result).toHaveProperty('total', 2);
    expect(result).toHaveProperty('per_page', 10);
    expect(result).toHaveProperty('current_Page', 1);
    expect(result).toHaveProperty('total_pages', 1);
    expect(result.next_page).toBeNull();
    expect(result.prev_page).toBeNull();
  });
});
