import AppError from "@shared/errors/AppError"
import { Customer } from "../infra/database/entities/Customers"
import { customerRepositories } from "../infra/database/repositories/CustomersRepositories"
import RedisCache from "@shared/cache/RedisCache"
import { IShowCustomer } from "../domain/models/IShowCustomer"

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