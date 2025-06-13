import { injectable, inject } from 'tsyringe';
import AppError from "@shared/errors/AppError"
import { Customer } from "../infra/database/entities/Customers"
import RedisCache from "@shared/cache/RedisCache"
import { ICreateCustomer } from "../domain/models/ICreateUser"
import { ICustomerRepositories } from "../domain/repositories/ICreateCustomerRepositories"


@injectable()
export default class CreateCustomerService {
  constructor(
    @inject('customerRepositories')
    private readonly customerRepositories: ICustomerRepositories,
  ) {}

  async execute({ name, email }: ICreateCustomer): Promise<Customer> {
    const redisCache = new RedisCache()

    if (!name || !email) {
      throw new AppError("Nome e e-mail são obrigatórios", 400)
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new AppError("Endereço de e-mail inválido", 400)
    }

    const emailExists = await this.customerRepositories.findByEmail(email)

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
