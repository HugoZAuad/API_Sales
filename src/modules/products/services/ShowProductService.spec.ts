import AppError from "@shared/errors/AppError";
import FakeProductsRepositories from "@modules/products/infra/database/repositories/Fakes/FakeProductsRepositories";
import ShowProductService from "./ShowProductService";

describe('ShowProductService', () => {
  let fakeProductsRepositories: FakeProductsRepositories;
  let showProductService: ShowProductService;

  beforeEach(() => {
    fakeProductsRepositories = new FakeProductsRepositories();
    showProductService = new ShowProductService(fakeProductsRepositories);
  });

  it('Deve retornar um produto existente pelo id', async () => {
    const product = await fakeProductsRepositories.create({
      name: 'Produto Teste',
      price: 100,
      quantity: 10,
    });

    const foundProduct = await showProductService.execute({ id: product.id });

    expect(foundProduct).toHaveProperty('id', product.id);
  });

  it('Deve lançar erro se o produto não for encontrado', async () => {
    await expect(showProductService.execute({ id: '999' })).rejects.toBeInstanceOf(AppError);
  });
});
