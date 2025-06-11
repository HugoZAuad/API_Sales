import AppError from "@shared/errors/AppError"
import { Customer } from "../infra/database/entities/Customers"
import RedisCache from "@shared/cache/RedisCache"
import { IUpdateCustomer } from "../domain/models/IUpdateCustomer"
import { ICustomerRepositories } from "../domain/repositories/ICreateCustomerRepositories"
import { injectable, inject } from "tsyringe"
@injectable()
export default class UpdateCustomerService {
  constructor(@inject('customerRepositories') private readonly customerRepositories: ICustomerRepositories) { }
  async execute({ id, name, email }: IUpdateCustomer): Promise<Customer> {
    const customer = await this.customerRepositories.findById(id)
    const redisCache = new RedisCache()

    if (!customer) {
      throw new AppError("Cliente não encontrado", 404)
    }

    const customerExists = await this.customerRepositories.findByEmail(email)

    if (customerExists && email !== customerExists.email) {
      throw new AppError("Já tem um cliente com este e-mail", 409)
    }

    customer.name = name
    customer.email = email

    await this.customerRepositories.save(customer)

    await redisCache.invalidate('api-mysales-CUSTOMER_LIST')

    return customer
  }
}
