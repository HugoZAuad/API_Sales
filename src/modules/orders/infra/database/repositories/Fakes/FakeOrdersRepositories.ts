import { IOrderRepositories } from "@modules/orders/domain/repositories/ICreateOrderRepositories";
import { ISaveOrder } from "@modules/orders/domain/models/ISaveOrder";
import { IOrder } from "@modules/orders/domain/models/IOrder";

const mockCustomer = {
  id: 1,
  name: 'Mock Customer',
  email: 'mock.customer@example.com',
  created_at: new Date(),
  updated_at: new Date(),
};

export default class FakeOrdersRepositories implements IOrderRepositories {
  private orders: IOrder[] = [];
  private currentId = 1;

  public async create(data: ISaveOrder): Promise<IOrder> {
    const order: IOrder = {
      id: this.currentId++,
      ...data,
      customer: mockCustomer,
      order_products: [],
      created_at: new Date(),
      updated_at: new Date(),
    };
    this.orders.push(order);
    return order;
  }

  public async save(order: IOrder): Promise<IOrder> {
    const findIndex = this.orders.findIndex(o => o.id === order.id);
    if (findIndex !== -1) {
      this.orders[findIndex] = order;
    }
    return order;
  }

  public async findById(id: number): Promise<IOrder | null> {
    const order = this.orders.find(o => o.id === id);
    return order || null;
  }
}
