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

  it('Deve lançar erro se o preço for negativo', async () => {
    const productData = makeFakeProduct({ price: -10 });

    await expect(createProduct.execute(productData)).rejects.toBeInstanceOf(AppError);
  });

  it('Deve lançar erro se a quantidade for zero ou negativa', async () => {
    const productDataZero = makeFakeProduct({ quantity: 0 });
    const productDataNegative = makeFakeProduct({ quantity: -5 });

    await expect(createProduct.execute(productDataZero)).rejects.toBeInstanceOf(AppError);
    await expect(createProduct.execute(productDataNegative)).rejects.toBeInstanceOf(AppError);
  });

  it('Deve criar produto com nome contendo caracteres especiais', async () => {
    const productData = makeFakeProduct({ name: 'Produto #1 @ Teste!' });

    const product = await createProduct.execute(productData);

    expect(product).toHaveProperty('id');
    expect(product.name).toBe(productData.name);
  });
});
