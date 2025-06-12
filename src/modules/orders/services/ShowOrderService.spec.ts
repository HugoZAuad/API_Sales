import AppError from "@shared/errors/AppError";
import FakeOrdersRepositories from "@modules/orders/domain/repositories/fakes/FakeOrdersRepositories";
import { ShowOrderService } from "./ShowOrderService";

describe('ShowOrderService', () => {
  let fakeOrdersRepositories: FakeOrdersRepositories;
  let showOrderService: ShowOrderService;

  beforeEach(() => {
    fakeOrdersRepositories = new FakeOrdersRepositories();
    showOrderService = new ShowOrderService(fakeOrdersRepositories);
  });

  it('Deve retornar um pedido existente pelo id', async () => {
    const order = await fakeOrdersRepositories.create({
      customer_id: '1',
      order_products: [
        { product_id: 'prod1', price: 10, quantity: 2 },
      ],
      customer: {
        id: 1,
        name: 'Cliente Teste',
        email: 'cliente@teste.com',
        created_at: new Date(),
        updated_at: new Date(),
      }
    });

    const foundOrder = await showOrderService.execute(order.id.toString());

    expect(foundOrder).toHaveProperty('id', order.id);
  });

  it('Deve lançar erro se o pedido não for encontrado', async () => {
    await expect(showOrderService.execute('999')).rejects.toBeInstanceOf(AppError);
  });
});
