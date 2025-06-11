import { IPagination } from "@shared/interfaces/PaginationInterface"
import { Customer } from "../infra/database/entities/Customers"
import RedisCache from "@shared/cache/RedisCache"
import { ICustomerRepositories } from "../domain/repositories/ICreateCustomerRepositories"
import { injectable, inject } from "tsyringe"

@injectable()
export default class ListCustomerService {
  constructor( @inject('customerRepositories') private readonly customerRepositories: ICustomerRepositories) {}
  async execute(page: number = 1, limit: number = 10): Promise<IPagination<Customer>> {
    const redisCache = new RedisCache()

    let Customer = await redisCache.recover<Customer[]>(
      'api-mysales-CUSTOMER_LIST',
    )

    if (!Customer) {
      Customer = await this.customerRepositories.find()
      await redisCache.save('api-mysales-CUSTOMER_LIST', JSON.stringify(Customer))
    }

    const [data, total] = await this.customerRepositories.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
    })

    const totalPages = Math.ceil(total / limit)

    return {
      data,
      total,
      per_page: limit,
      current_Page: page,
      total_pages: totalPages,
      next_page: page < totalPages ? page + 1 : null,
      prev_page: page > 1 ? page - 1 : null,
    } as IPagination<Customer>
  }
}