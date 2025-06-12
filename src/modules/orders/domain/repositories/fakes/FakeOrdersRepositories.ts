import { Order } from "@modules/orders/infra/database/entities/Orders";
import { OrdersProducts } from "@modules/orders/infra/database/entities/OrdersProducts";
import { IOrderRepositories } from "../ICreateOrderRepositories";
import { ISaveOrder } from "../../models/ISaveOrder";

export default class FakeOrdersRepositories implements IOrderRepositories {
  private orders: Order[] = [];

  public async create(data: ISaveOrder): Promise<Order> {
    const order = new Order();

    order.id = this.orders.length + 1;
    order.customer = data.customer!;

    order.order_products = data.order_products.map(op => {
      const orderProduct = new OrdersProducts();
      orderProduct.product_id = op.product_id;
      orderProduct.price = op.price;
      orderProduct.quantity = op.quantity;
      return orderProduct;
    });

    order.created_at = new Date();
    order.updated_at = new Date();

    this.orders.push(order);

    return order;
  }

  public async save(order: Order): Promise<Order> {
    const findIndex = this.orders.findIndex(findOrder => findOrder.id === order.id);

    if (findIndex !== -1) {
      this.orders[findIndex] = order;
    }

    return order;
  }

  public async findById(id: number): Promise<Order | null> {
    const order = this.orders.find(order => order.id === id);
    return order || null;
  }
}
