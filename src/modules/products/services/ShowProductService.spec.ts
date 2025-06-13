import AppError from "@shared/errors/AppError";
import { makeFakeProduct, makeFakeProductRepository } from "@modules/products/domain/factory/ProductFactory";
import ShowProductService from "./ShowProductService";

describe('ShowProductService', () => {
  let fakeProductsRepositories: ReturnType<typeof makeFakeProductRepository>;
  let showProductService: ShowProductService;

  beforeEach(() => {
    fakeProductsRepositories = makeFakeProductRepository();
    showProductService = new ShowProductService(fakeProductsRepositories);
  });

  it('Deve retornar um produto existente pelo id', async () => {
    const productData = makeFakeProduct({ name: 'Produto Teste', price: 100, quantity: 10 });
    const product = await fakeProductsRepositories.create(productData);

    const foundProduct = await showProductService.execute({ id: product.id });

    expect(foundProduct).toHaveProperty('id', product.id);
  });

  it('Deve lançar erro se o produto não for encontrado', async () => {
    await expect(showProductService.execute({ id: '999' })).rejects.toBeInstanceOf(AppError);
  });
});
