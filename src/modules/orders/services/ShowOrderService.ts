import AppError from "@shared/errors/AppError"
import { Order } from "../database/entities/Orders"
import { orderRepositories } from "../database/repositories/OrderRepositories"

export class ShowOrderService {
  async execute(id: string): Promise<Order> {
    const order = await orderRepositories.findById(Number(id))
    if (!order) {
      throw new AppError("Pedido não encontrado")
    }

    return order
  }
}