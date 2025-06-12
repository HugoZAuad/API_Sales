import AppError from "@shared/errors/AppError";
import ShowCustomerService from "@modules/customers/services/ShowCustomerService";

import { setupCustomerServiceTest } from "../domain/factory/CustomerServiceTestUtils";

describe('ShowCustomerService', () => {
  let showCustomer: ShowCustomerService;
  const { getFakeCustomerRepository, makeFakeCustomer } = setupCustomerServiceTest();

  beforeEach(() => {
    showCustomer = new ShowCustomerService(getFakeCustomerRepository());
  });

  it('Should be able to show an existing customer', async () => {
    const customerData = makeFakeCustomer();

    const customer = await getFakeCustomerRepository().create(customerData);

    const foundCustomer = await showCustomer.execute({ id: customer.id });

    expect(foundCustomer).toHaveProperty('id');
    expect(foundCustomer.email).toBe(customerData.email);
  });

  it('Should not be able to show a non-existing customer', async () => {
    await expect(showCustomer.execute({ id: 9999 })).rejects.toBeInstanceOf(AppError);
  });
});
