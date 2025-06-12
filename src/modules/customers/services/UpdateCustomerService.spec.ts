import AppError from "@shared/errors/AppError";
import UpdateCustomerService from "@modules/customers/services/UpdateCustomerService";

import { setupCustomerServiceTest } from "../domain/factory/CustomerServiceTestUtils";

describe('UpdateCustomerService', () => {
  let updateCustomer: UpdateCustomerService;
  const { getFakeCustomerRepository, makeFakeCustomer } = setupCustomerServiceTest();

  beforeEach(() => {
    updateCustomer = new UpdateCustomerService(getFakeCustomerRepository());
  });

  it('Should be able to update an existing customer', async () => {
    const customerData = makeFakeCustomer();

    const customer = await getFakeCustomerRepository().create(customerData);

    const updatedCustomer = await updateCustomer.execute({
      id: customer.id,
      name: 'John Updated',
      email: 'john.updated@example.com',
    });

    expect(updatedCustomer.name).toBe('John Updated');
    expect(updatedCustomer.email).toBe('john.updated@example.com');
  });

  it('Should not be able to update a non-existing customer', async () => {
    await expect(
      updateCustomer.execute({
        id: 9999,
        name: 'John Updated',
        email: 'john.updated@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to update to an email that is already in use', async () => {
    await getFakeCustomerRepository().create(makeFakeCustomer({ email: 'existing@example.com' }));

    const customer = await getFakeCustomerRepository().create(makeFakeCustomer());

    await expect(
      updateCustomer.execute({
        id: customer.id,
        name: 'John Updated',
        email: 'existing@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
