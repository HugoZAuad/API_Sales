import FakeCustomerRepositories from "@modules/customers/infra/database/repositories/Fakes/FakeCustomerRepositories";
import { ICustomerRepositories } from "@modules/customers/domain/repositories/ICreateCustomerRepositories";

interface CustomerData {
  name: string;
  email: string;
}

export function makeFakeCustomer(overrides?: Partial<CustomerData>): CustomerData {
  return {
    name: 'John Doe',
    email: 'john.doe@example.com',
    ...overrides,
  };
}

export function makeFakeCustomerRepository(): ICustomerRepositories {
  return new FakeCustomerRepositories();
}
