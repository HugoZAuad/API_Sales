import AppError from "@shared/errors/AppError";
import { makeFakeProduct, makeFakeProductRepository } from "@modules/products/domain/factory/ProductFactory";
import DeleteProductService from "./DeleteProductService";

describe('DeleteProductService', () => {
  let fakeProductsRepositories: ReturnType<typeof makeFakeProductRepository>;
  let deleteProductService: DeleteProductService;

  beforeEach(() => {
    fakeProductsRepositories = makeFakeProductRepository();
    deleteProductService = new DeleteProductService(fakeProductsRepositories);
  });

  it('Deve remover um produto existente com sucesso', async () => {
    const productData = makeFakeProduct({ name: 'Produto Teste', price: 100, quantity: 10 });
    const product = await fakeProductsRepositories.create(productData);

    await expect(deleteProductService.execute({ id: product.id })).resolves.toBeUndefined();

    const foundProduct = await fakeProductsRepositories.findById(product.id);
    expect(foundProduct).toBeNull();
  });

  it('Deve lançar erro se o produto não for encontrado', async () => {
    await expect(deleteProductService.execute({ id: '999' })).rejects.toBeInstanceOf(AppError);
  });
});
