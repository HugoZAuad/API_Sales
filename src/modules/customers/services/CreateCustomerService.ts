import AppError from "@shared/errors/AppError"
import { Customer } from "../infra/database/entities/Customers"
import { customerRepositories } from "../infra/database/repositories/CustomersRepositories"
import RedisCache from "@shared/cache/RedisCache"

interface ICreateCustomer {
  name: string
  email: string
}

export default class CreateCustomerService {
  async execute({ name, email }: ICreateCustomer): Promise<Customer> {
    const emailExists = await customerRepositories.findByEmail(email)
    const redisCache = new RedisCache()

    if (emailExists) {
      throw new AppError("O endereço de e-mail já esta sendo usado", 409)
    }

    const customer = customerRepositories.create({
      name,
      email,
    })

    await customerRepositories.save(customer)

    await redisCache.invalidate('api-mysales-CUSTOMER_LIST')

    return customer
  }
}
