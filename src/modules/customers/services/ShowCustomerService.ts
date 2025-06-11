import AppError from "@shared/errors/AppError"
import { Customer } from "../infra/database/entities/Customers"
import RedisCache from "@shared/cache/RedisCache"
import { IShowCustomer } from "../domain/models/IShowCustomer"
import { ICustomerRepositories } from "../domain/repositories/ICreateCustomerRepositories"

export default class ShowCustomerService {
  constructor(private readonly customerRepositories: ICustomerRepositories) { }
  async execute({ id }: IShowCustomer): Promise<Customer> {
    const customer = await this.customerRepositories.findById(id)
    const redisCache = new RedisCache()
    if (!customer) {
      throw new AppError("Cliente não encontrado", 404)
    }
    await redisCache.invalidate('api-mysales-CUSTOMER_LIST')
    return customer
  }
}