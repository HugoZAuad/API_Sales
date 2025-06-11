import AppError from "@shared/errors/AppError"
import { customerRepositories } from "../infra/database/repositories/CustomersRepositories"
import RedisCache from "@shared/cache/RedisCache"

interface IDeleteCustomer {
  id: number
}

export default class DeleteCustomerService {
  async execute({ id }: IDeleteCustomer): Promise<void> {
    const customer = await customerRepositories.findById(id)
    const redisCache = new RedisCache()

    if (!customer) {
      throw new AppError("Clienten não encontrado.", 404)
    }

    await redisCache.invalidate('api-mysales-CUSTOMER_LIST')

    await customerRepositories.remove(customer)
  }
}