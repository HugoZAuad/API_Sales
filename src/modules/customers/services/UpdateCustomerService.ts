import AppError from "@shared/errors/AppError"
import { Customer } from "../database/entities/Customers"
import { customerRepositories } from "../database/repositories/CustomersRepositories"
import RedisCache from "@shared/cache/RedisCache"

interface IUpdateCustomer {
  id: number,
  name: string,
  email: string,
}

export default class UpdateCustomerService {
  async execute({ id, name, email }: IUpdateCustomer): Promise<Customer> {
    const customer = await customerRepositories.findById(id)
    const redisCache = new RedisCache()

    if (!customer) {
      throw new AppError("Cliente não encontrado", 404)
    }

    const customerExists = await customerRepositories.findByEmail(email)

    if (customerExists && email !== customerExists.email) {
      throw new AppError("Já tem um cliente com este e-mail", 409)
    }

    customer.name = name
    customer.email = email

    await customerRepositories.save(customer)

    await redisCache.invalidate('api-mysales-CUSTOMER_LIST')

    return customer
  }
}
