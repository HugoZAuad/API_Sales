import ListOrderService from './ListOrderService';
import { makeFakeOrderRepository } from '../domain/factory/OrderFactory';

describe('ListOrderService', () => {
  let listOrderService: ListOrderService;

  beforeEach(() => {
    const fakeOrderRepository = makeFakeOrderRepository();
    listOrderService = new ListOrderService(fakeOrderRepository);
  });

  it('should list orders with pagination', async () => {
    const page = 1;
    const limit = 10;

    const result = await listOrderService.execute({ page, limit });

    expect(Array.isArray(result)).toBe(true);
  });
});
