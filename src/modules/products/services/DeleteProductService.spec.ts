import AppError from "@shared/errors/AppError";
import FakeProductsRepositories from "@modules/products/infra/database/repositories/Fakes/FakeProductsRepositories";
import DeleteProductService from "./DeleteProductService";

describe('DeleteProductService', () => {
  let fakeProductsRepositories: FakeProductsRepositories;
  let deleteProductService: DeleteProductService;

  beforeEach(() => {
    fakeProductsRepositories = new FakeProductsRepositories();
    deleteProductService = new DeleteProductService(fakeProductsRepositories);
  });

  it('Deve remover um produto existente com sucesso', async () => {
    const product = await fakeProductsRepositories.create({
      name: 'Produto Teste',
      price: 100,
      quantity: 10,
    });

    await expect(deleteProductService.execute({ id: product.id })).resolves.toBeUndefined();

    const foundProduct = await fakeProductsRepositories.findById(product.id);
    expect(foundProduct).toBeNull();
  });

  it('Deve lançar erro se o produto não for encontrado', async () => {
    await expect(deleteProductService.execute({ id: '999' })).rejects.toBeInstanceOf(AppError);
  });
});
