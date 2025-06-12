import FakeOrdersRepositories from "@modules/orders/domain/repositories/fakes/FakeOrdersRepositories";
import { ICreateOrderRepositories } from "@modules/orders/domain/repositories/ICreateOrderRepositories";

interface OrderProductData {
  product_id: string;
  price: number;
  quantity: number;
}

interface OrderData {
  customer_id: string;
  order_products: OrderProductData[];
  customer?: {
    id: number;
    name: string;
    email: string;
    created_at: Date;
    updated_at: Date;
  };
}

export function makeFakeOrder(overrides?: Partial<OrderData>): OrderData {
  return {
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
    },
    ...overrides,
  };
}

export function makeFakeOrderRepository(): ICreateOrderRepositories {
  return new FakeOrdersRepositories();
}
