import AppError from "@shared/errors/AppError";
import FakeProductsRepositories from "@modules/products/infra/database/repositories/Fakes/FakeProductsRepositories";
import CreateProductService from "./CreateProductService";

describe('CreateProductService', () => {
  it('Deve criar um novo produto com sucesso', async () => {
    const fakeProductsRepositories = new FakeProductsRepositories();
    const createProduct = new CreateProductService(fakeProductsRepositories);

    const product = await createProduct.execute({
      name: 'Produto Teste',
      price: 100,
      quantity: 10,
    });

    expect(product).toHaveProperty('id');
    expect(product.name).toBe('Produto Teste');
  });

  it('Deve lançar erro se o nome do produto já existir', async () => {
    const fakeProductsRepositories = new FakeProductsRepositories();
    const createProduct = new CreateProductService(fakeProductsRepositories);

    await createProduct.execute({
      name: 'Produto Teste',
      price: 100,
      quantity: 10,
    });

    await expect(
      createProduct.execute({
        name: 'Produto Teste',
        price: 200,
        quantity: 5,
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
