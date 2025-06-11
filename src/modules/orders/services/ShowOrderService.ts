import AppError from "@shared/errors/AppError"
import { Order } from "../infra/database/entities/Orders"
import RedisCache from "@shared/cache/RedisCache"
import { IOrderRepositories } from "../domain/repositories/ICreateOrderRepositories"

export class ShowOrderService {
  constructor(private readonly orderRepositories: IOrderRepositories) { }
  async execute(id: string): Promise<Order> {
    const order = await this.orderRepositories.findById(Number(id))
    const redisCache = new RedisCache()

    if (!order) {
      throw new AppError("Pedido não encontrado")
    }

    await redisCache.invalidate('api-mysales-ORDER_LIST')

    return order
  }
}