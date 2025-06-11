import AppError from "@shared/errors/AppError"
import { Customer } from "../infra/database/entities/Customers"
import RedisCache from "@shared/cache/RedisCache"
import { ICreateCustomer } from "../domain/models/ICreateUser"
import { ICustomerRepositories } from "../domain/repositories/ICreateCustomerRepositories"
export default class CreateCustomerService {
  constructor(private readonly customerRepositories: ICustomerRepositories) {}
  async execute({ name, email }: ICreateCustomer): Promise<Customer> {
    const emailExists = await this.customerRepositories.findByEmail(email)
    const redisCache = new RedisCache()

    if (emailExists) {
      throw new AppError("O endereço de e-mail já esta sendo usado", 409)
    }

    const customer = await this.customerRepositories.create({
      name,
      email,
    })

    await redisCache.invalidate('api-mysales-CUSTOMER_LIST')

    return customer
  }
}
