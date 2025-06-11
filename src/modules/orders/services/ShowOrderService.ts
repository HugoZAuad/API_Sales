import AppError from "@shared/errors/AppError"
import { Order } from "../database/entities/Orders"
import { orderRepositories } from "../database/repositories/OrderRepositories"
import RedisCache from "@shared/cache/RedisCache"

export class ShowOrderService {
  async execute(id: string): Promise<Order> {
    const order = await orderRepositories.findById(Number(id))
    const redisCache = new RedisCache()

    if (!order) {
      throw new AppError("Pedido não encontrado")
    }

    await redisCache.invalidate('api-mysales-ORDER_LIST')

    return order
  }
}