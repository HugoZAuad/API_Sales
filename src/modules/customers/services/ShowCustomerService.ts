import AppError from "@shared/errors/AppError"
import { Customer } from "../database/entities/Customers"
import { customerRepositories } from "../database/repositories/CustomersRepositories"
import RedisCache from "@shared/cache/RedisCache"

interface IShowCustomer {
  id: number
}

export default class ShowCustomerService {
  async execute({ id }: IShowCustomer): Promise<Customer> {
    const customer = await customerRepositories.findById(id)
    const redisCache = new RedisCache()
    if (!customer) {
      throw new AppError("Cliente não encontrado", 404)
    }
    await redisCache.invalidate('api-mysales-CUSTOMER_LIST')
    return customer
  }
}