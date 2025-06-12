import AppError from "@shared/errors/AppError";
import { makeFakeProduct, makeFakeProductRepository } from "@modules/products/domain/factory/ProductFactory";
import CreateProductService from "./CreateProductService";

import { IProductRepositories } from "@modules/products/domain/repositories/ICreateProductRepositories";

describe('CreateProductService', () => {
  let fakeProductsRepositories: IProductRepositories;
  let createProduct: CreateProductService;

  beforeEach(() => {
    fakeProductsRepositories = makeFakeProductRepository();
    createProduct = new CreateProductService(fakeProductsRepositories);
  });

  it('Deve criar um novo produto com sucesso', async () => {
    const productData = makeFakeProduct({ name: 'Unique Product', price: 100, quantity: 10 });

    const product = await createProduct.execute(productData);

    expect(product).toHaveProperty('id');
    expect(product.name).toBe(productData.name);
  });

  it('Deve lançar erro se o nome do produto já existir', async () => {
    const productData = makeFakeProduct({ name: 'Duplicate Product', price: 100, quantity: 10 });

    await createProduct.execute(productData);

    await expect(
      createProduct.execute(productData)
    ).rejects.toBeInstanceOf(AppError);
  });
});
