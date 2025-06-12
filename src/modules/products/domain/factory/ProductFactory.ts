import FakeProductsRepositories from "@modules/products/infra/database/repositories/Fakes/FakeProductsRepositories";
import { IProductRepositories } from "@modules/products/domain/repositories/ICreateProductRepositories";

interface ProductData {
  name: string;
  price: number;
  description?: string;
  quantity: number;
}

export function makeFakeProduct(overrides?: Partial<ProductData>): ProductData {
  return {
    name: 'Sample Product',
    price: 10.0,
    description: 'Sample product description',
    quantity: 100,
    ...overrides,
  };
}

export function makeFakeProductRepository(): IProductRepositories {
  return new FakeProductsRepositories();
}
