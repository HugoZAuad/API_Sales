import FakeProductsRepositories from "@modules/products/infra/database/repositories/Fakes/FakeProductsRepositories";
import ListProductService from "./ListProductService";
import RedisCache from "@shared/cache/RedisCache";

jest.mock("@shared/cache/RedisCache");

describe('ListProductService', () => {
  let fakeProductsRepositories: FakeProductsRepositories;
  let listProductService: ListProductService;
  let redisCacheMock: jest.Mocked<RedisCache>;

  beforeEach(() => {
    fakeProductsRepositories = new FakeProductsRepositories();
    listProductService = new ListProductService(fakeProductsRepositories);
    redisCacheMock = new RedisCache() as jest.Mocked<RedisCache>;
  });

  it('Deve retornar a lista paginada de produtos', async () => {
    // Mock do método recover para retornar null e forçar busca no repositório
    redisCacheMock.recover.mockResolvedValue(null);
    redisCacheMock.save.mockResolvedValue();

    // Criar alguns produtos no fake repository
    await fakeProductsRepositories.create({ name: 'Produto 1', price: 10, quantity: 5 });
    await fakeProductsRepositories.create({ name: 'Produto 2', price: 20, quantity: 10 });

    const result = await listProductService.execute(1, 10);

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
