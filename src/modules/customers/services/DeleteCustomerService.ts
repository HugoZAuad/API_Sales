import AppError from "@shared/errors/AppError"
import RedisCache from "@shared/cache/RedisCache"
import { IDeleteCustomer } from "../domain/models/IDeleteCustomer"
import { ICustomerRepositories } from "../domain/repositories/ICreateCustomerRepositories"
import { inject, injectable } from "tsyringe"

@injectable()
export default class DeleteCustomerService {
  constructor(@inject('customerRepositories') private readonly customerRepositories: ICustomerRepositories) {}
  async execute({ id }: IDeleteCustomer): Promise<void> {
    const customer = await this.customerRepositories.findById(id)
    const redisCache = new RedisCache()

    if (!customer) {
      throw new AppError("Clienten não encontrado.", 404)
    }

    await redisCache.invalidate('api-mysales-CUSTOMER_LIST')

    await this.customerRepositories.remove(customer)
  }
}