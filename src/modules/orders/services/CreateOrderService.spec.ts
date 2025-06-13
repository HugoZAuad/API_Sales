import AppError from "@shared/errors/AppError";
import { CreateOrderService } from "./CreateOrderService";

import { setupOrderServiceTest } from "../domain/factory/OrderServiceTestUtils";

describe('CreateOrderService', () => {
  let createOrderService: CreateOrderService;
  const { getFakeOrderRepository, getFakeProductRepository, getFakeCustomerRepository } = setupOrderServiceTest();

  beforeEach(() => {
    createOrderService = new CreateOrderService(
      getFakeProductRepository(),
      getFakeCustomerRepository(),
      getFakeOrderRepository(),
    );
  });

  it('Deve criar um novo pedido com sucesso', async () => {
    jest.spyOn(getFakeCustomerRepository(), 'findById').mockResolvedValue({
      id: 1,
      name: 'Cliente Teste',
      email: 'cliente@teste.com',
      created_at: new Date(),
      updated_at: new Date(),
    });

    jest.spyOn(getFakeProductRepository(), 'findAllByIds').mockResolvedValue([
      { id: 'prod1', name: 'Produto 1', price: 10, quantity: 5, order_products: [], created_at: new Date(), updated_at: new Date() },
      { id: 'prod2', name: 'Produto 2', price: 20, quantity: 10, order_products: [], created_at: new Date(), updated_at: new Date() },
    ]);

    jest.spyOn(getFakeProductRepository(), 'save').mockResolvedValue({
      id: 'prod1',
      name: 'Produto 1',
      price: 10,
      quantity: 5,
      order_products: [],
      created_at: new Date(),
      updated_at: new Date(),
    });

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
    jest.spyOn(getFakeCustomerRepository(), 'findById').mockResolvedValue(null);

    await expect(
      createOrderService.execute({
        customer_id: '1',
        order_products: [],
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Deve lançar erro se produtos não forem encontrados', async () => {
    jest.spyOn(getFakeCustomerRepository(), 'findById').mockResolvedValue({ id: 1, name: 'Cliente Teste', email: 'cliente@teste.com', created_at: new Date(), updated_at: new Date() });

    jest.spyOn(getFakeProductRepository(), 'findAllByIds').mockResolvedValue([]);

    await expect(
      createOrderService.execute({
        customer_id: '1',
        order_products: [{ product_id: 'prod1', price: 10, quantity: 1 }],
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Deve lançar erro se algum produto não existir', async () => {
    jest.spyOn(getFakeCustomerRepository(), 'findById').mockResolvedValue({ id: 1, name: 'Cliente Teste', email: 'cliente@teste.com', created_at: new Date(), updated_at: new Date() });

    jest.spyOn(getFakeProductRepository(), 'findAllByIds').mockResolvedValue([
      { id: 'prod2', name: 'Produto 2', price: 20, quantity: 10, order_products: [], created_at: new Date(), updated_at: new Date() },
    ]);

    await expect(
      createOrderService.execute({
        customer_id: '1',
        order_products: [{ product_id: 'prod1', price: 10, quantity: 1 }],
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Deve lançar erro se a quantidade solicitada não estiver disponível', async () => {
    jest.spyOn(getFakeCustomerRepository(), 'findById').mockResolvedValue({ id: 1, name: 'Cliente Teste', email: 'cliente@teste.com', created_at: new Date(), updated_at: new Date() });

    jest.spyOn(getFakeProductRepository(), 'findAllByIds').mockResolvedValue([
      { id: 'prod1', name: 'Produto 1', price: 10, quantity: 1, order_products: [], created_at: new Date(), updated_at: new Date() },
    ]);

    await expect(
      createOrderService.execute({
        customer_id: '1',
        order_products: [{ product_id: 'prod1', price: 10, quantity: 2 }],
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Deve lançar erro se dados inválidos forem fornecidos', async () => {
    jest.spyOn(getFakeCustomerRepository(), 'findById').mockResolvedValue({ id: 1, name: 'Cliente Teste', email: 'cliente@teste.com', created_at: new Date(), updated_at: new Date() });
    jest.spyOn(getFakeProductRepository(), 'findAllByIds').mockResolvedValue([
      { id: 'prod1', name: 'Produto 1', price: 10, quantity: 5, order_products: [], created_at: new Date(), updated_at: new Date() },
    ]);

    await expect(
      createOrderService.execute({
        customer_id: '',
        order_products: [{ product_id: '', price: -10, quantity: -1 }],
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Deve lançar erro se o array de produtos estiver vazio', async () => {
    jest.spyOn(getFakeCustomerRepository(), 'findById').mockResolvedValue({ id: 1, name: 'Cliente Teste', email: 'cliente@teste.com', created_at: new Date(), updated_at: new Date() });

    await expect(
      createOrderService.execute({
        customer_id: '1',
        order_products: [],
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
