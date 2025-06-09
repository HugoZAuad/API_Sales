import { AppDataSource } from "@shared/typeorm/data-source"
import { Customer } from "@modules/customers/database/entities/Customers"
import { OrdersProducts } from "../entities/OrdersProducts"
import { Order } from "../entities/Orders"

interface ICreateOrder{
  customer: Customer
  products: OrdersProducts[]
}

export const orderRepositories = AppDataSource.getRepository(Order).extend({
  async findById(id: number): Promise<Order | null> {
    const order = await this.findOne({
      where: { id },
      relations: ['order_products', 'customer']
    })
    return order
  },

  async createOrder({ customer, products }: ICreateOrder): Promise<Order> {
    const order = this.create({
      customer,
      order_products: products,
    })
    await this.save(order)
    return order
  }

})