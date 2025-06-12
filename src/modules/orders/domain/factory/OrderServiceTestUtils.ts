import { makeFakeOrder, makeFakeOrderRepository } from "@modules/orders/domain/factory/OrderFactory";
import { makeFakeProductRepository } from "@modules/products/domain/factory/ProductFactory";
import { makeFakeCustomerRepository } from "@modules/customers/domain/factory/CustomerFactory";

import { IOrderRepositories } from "@modules/orders/domain/repositories/ICreateOrderRepositories";
import { IProductRepositories } from "@modules/products/domain/repositories/ICreateProductRepositories";
import { ICustomerRepositories } from "@modules/customers/domain/repositories/ICreateCustomerRepositories";

export function setupOrderServiceTest() {
  let fakeOrderRepository: IOrderRepositories;
  let fakeProductRepository: IProductRepositories;
  let fakeCustomerRepository: ICustomerRepositories;

  beforeEach(() => {
    fakeOrderRepository = makeFakeOrderRepository();
    fakeProductRepository = makeFakeProductRepository();
    fakeCustomerRepository = makeFakeCustomerRepository();
  });

  return {
    getFakeOrderRepository: () => fakeOrderRepository,
    getFakeProductRepository: () => fakeProductRepository,
    getFakeCustomerRepository: () => fakeCustomerRepository,
    makeFakeOrder,
  };
}
