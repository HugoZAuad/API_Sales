import { makeFakeCustomer, makeFakeCustomerRepository } from "@modules/customers/domain/factory/CustomerFactory";
import { ICustomerRepositories } from "@modules/customers/domain/repositories/ICreateCustomerRepositories";

export function setupCustomerServiceTest() {
  let fakeCustomerRepositories: ICustomerRepositories;

  beforeEach(() => {
    fakeCustomerRepositories = makeFakeCustomerRepository();
  });

  return {
    getFakeCustomerRepository: () => fakeCustomerRepositories,
    makeFakeCustomer,
  };
}
