import AppError from "@shared/errors/AppError";
import FakeOrdersRepositories from "@modules/orders/domain/repositories/fakes/FakeOrdersRepositories";
import { CreateOrderService } from "./CreateOrderService";
import { IProductRepositories } from "@modules/products/domain/repositories/ICreateProductRepositories";
import { ICustomerRepositories } from "@modules/customers/domain/repositories/ICreateCustomerRepositories";

describe('CreateOrderService', () => {
  let fakeOrdersRepositories: FakeOrdersRepositories;
  let createOrderService: CreateOrderService;

  // Mocks para productRepositories e customerRepositories
  const fakeProductRepositories = {
    findAllByIds: jest.fn(),
    save: jest.fn(),
  };

  const fakeCustomerRepositories = {
    findById: jest.fn(),
  };

  beforeEach(() => {
    fakeOrdersRepositories = new FakeOrdersRepositories();
    createOrderService = new CreateOrderService(
      fakeProductRepositories as unknown as IProductRepositories,
      fakeCustomerRepositories as unknown as ICustomerRepositories,
      fakeOrdersRepositories,
    );
  });

  it('Deve criar um novo pedido com sucesso', async () => {
    fakeCustomerRepositories.findById.mockResolvedValue({
      id: 1,
      name: 'Cliente Teste',
      email: 'cliente@teste.com',
    });

    fakeProductRepositories.findAllByIds.mockResolvedValue([
      { id: 'prod1', name: 'Produto 1', price: 10, quantity: 5 },
      { id: 'prod2', name: 'Produto 2', price: 20, quantity: 10 },
    ]);

    fakeProductRepositories.save.mockResolvedValue(undefined);

    const orderData = {
      customer_id: '1',
      order_products: [
        { product_id: 'prod1', price: 10, quantity: 2 },
        { product_id: 'prod2', price: 20, quantity: 3 },
      ],
    };

    const order = await createOrderService.execute(orderData);

    expect(order).toHaveProperty('id');
    expect(order.customer.id).toBe(1);
    expect(order.order_products).toHaveLength(2);
  });

  it('Deve lançar erro se cliente não for encontrado', async () => {
    fakeCustomerRepositories.findById.mockResolvedValue(null);

    await expect(
      createOrderService.execute({
        customer_id: '1',
        order_products: [],
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Deve lançar erro se produtos não forem encontrados', async () => {
    fakeCustomerRepositories.findById.mockResolvedValue({ id: 1 });

    fakeProductRepositories.findAllByIds.mockResolvedValue([]);

    await expect(
      createOrderService.execute({
        customer_id: '1',
        order_products: [{ product_id: 'prod1', price: 10, quantity: 1 }],
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Deve lançar erro se algum produto não existir', async () => {
    fakeCustomerRepositories.findById.mockResolvedValue({ id: 1 });

    fakeProductRepositories.findAllByIds.mockResolvedValue([
      { id: 'prod2', name: 'Produto 2', price: 20, quantity: 10 },
    ]);

    await expect(
      createOrderService.execute({
        customer_id: '1',
        order_products: [{ product_id: 'prod1', price: 10, quantity: 1 }],
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Deve lançar erro se a quantidade solicitada não estiver disponível', async () => {
    fakeCustomerRepositories.findById.mockResolvedValue({ id: 1 });

    fakeProductRepositories.findAllByIds.mockResolvedValue([
      { id: 'prod1', name: 'Produto 1', price: 10, quantity: 1 },
    ]);

    await expect(
      createOrderService.execute({
        customer_id: '1',
        order_products: [{ product_id: 'prod1', price: 10, quantity: 2 }],
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
