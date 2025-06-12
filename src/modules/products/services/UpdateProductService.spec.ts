import AppError from "@shared/errors/AppError";
import FakeProductsRepositories from "@modules/products/infra/database/repositories/Fakes/FakeProductsRepositories";
import UpdateProductService from "./UpdateProductService";

describe('UpdateProductService', () => {
  let fakeProductsRepositories: FakeProductsRepositories;
  let updateProductService: UpdateProductService;

  beforeEach(() => {
    fakeProductsRepositories = new FakeProductsRepositories();
    updateProductService = new UpdateProductService(fakeProductsRepositories);
  });

  it('Deve atualizar um produto existente com sucesso', async () => {
    const product = await fakeProductsRepositories.create({
      name: 'Produto Teste',
      price: 100,
      quantity: 10,
    });

    const updatedProduct = await updateProductService.execute({
      id: product.id,
      name: 'Produto Atualizado',
      price: 150,
      quantity: 5,
    });

    expect(updatedProduct.name).toBe('Produto Atualizado');
    expect(updatedProduct.price).toBe(150);
    expect(updatedProduct.quantity).toBe(5);
  });

  it('Deve lançar erro se o produto não for encontrado', async () => {
    await expect(
      updateProductService.execute({
        id: '999',
        name: 'Produto Teste',
        price: 100,
        quantity: 10,
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Deve lançar erro se já existir outro produto com o mesmo nome', async () => {
    await fakeProductsRepositories.create({
      name: 'Produto Existente',
      price: 100,
      quantity: 10,
    });

    const product = await fakeProductsRepositories.create({
      name: 'Produto Teste',
      price: 100,
      quantity: 10,
    });

    await expect(
      updateProductService.execute({
        id: product.id,
        name: 'Produto Existente',
        price: 150,
        quantity: 5,
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
