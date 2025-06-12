import AppError from "@shared/errors/AppError";
import DeleteCustomerService from "@modules/customers/services/DeleteCustomerService";

import { setupCustomerServiceTest } from "../domain/factory/CustomerServiceTestUtils";

describe('DeleteCustomerService', () => {
  let deleteCustomer: DeleteCustomerService;
  const { getFakeCustomerRepository, makeFakeCustomer } = setupCustomerServiceTest();

  beforeEach(() => {
    deleteCustomer = new DeleteCustomerService(getFakeCustomerRepository());
  });

  it('Should be able to delete an existing customer', async () => {
    const customerData = makeFakeCustomer();

    const customer = await getFakeCustomerRepository().create(customerData);

    await expect(deleteCustomer.execute({ id: customer.id })).resolves.toBeUndefined();
  });

  it('Should not be able to delete a non-existing customer', async () => {
    await expect(deleteCustomer.execute({ id: 9999 })).rejects.toBeInstanceOf(AppError);
  });
});
