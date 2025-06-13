import AppError from "@shared/errors/AppError";
import { ShowOrderService } from "./ShowOrderService";
import { setupOrderServiceTest } from "../domain/factory/OrderServiceTestUtils";

describe('ShowOrderService', () => {
  let showOrderService: ShowOrderService;
  const { getFakeOrderRepository, makeFakeOrder } = setupOrderServiceTest();

  beforeEach(() => {
    showOrderService = new ShowOrderService(getFakeOrderRepository());
  });

  it('Deve retornar um pedido existente pelo id', async () => {
    const fakeOrder = makeFakeOrder();

    const order = await getFakeOrderRepository().create(fakeOrder);

    const foundOrder = await showOrderService.execute(order.id.toString());

    expect(foundOrder).toHaveProperty('id', order.id);
  });

  it('Deve lançar erro se o pedido não for encontrado', async () => {
    await expect(showOrderService.execute('999')).rejects.toBeInstanceOf(AppError);
  });
});
