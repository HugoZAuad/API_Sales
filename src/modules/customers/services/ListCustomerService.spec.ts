import ListCustomerService from "@modules/customers/services/ListCustomerService";

import { setupCustomerServiceTest } from "../domain/factory/CustomerServiceTestUtils";

describe('ListCustomerService', () => {
  let listCustomer: ListCustomerService;
  const { getFakeCustomerRepository, makeFakeCustomer } = setupCustomerServiceTest();

  beforeEach(() => {
    listCustomer = new ListCustomerService(getFakeCustomerRepository());
  });

  it('Should be able to list customers with pagination', async () => {
    await getFakeCustomerRepository().create(makeFakeCustomer({ email: 'john.doe@example.com' }));
    await getFakeCustomerRepository().create(makeFakeCustomer({ email: 'jane.doe@example.com' }));

    const result = await listCustomer.execute(1, 10);

    expect(result).toHaveProperty('data');
    expect(result.data.length).toBeGreaterThan(0);
    expect(result).toHaveProperty('total');
    expect(result).toHaveProperty('per_page');
    expect(result).toHaveProperty('current_Page');
    expect(result).toHaveProperty('total_pages');
  });
});
