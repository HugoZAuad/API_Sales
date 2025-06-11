import { IPagination } from "@shared/interfaces/PaginationInterface"
import { Product } from "../infra/database/entities/Product"
import RedisCache from "@shared/cache/RedisCache"
import { IProductRepositories } from "../domain/repositories/ICreateProductRepositories"

export default class ListProductService {
  constructor(private readonly productsRepositories: IProductRepositories) {}
  async execute(page: number = 1, limit: number = 10): Promise<IPagination<Product>> {
    const redisCache = new RedisCache()

    let products = await redisCache.recover<Product[]>(
      'api-mysales-PRODUCT_LIST',
    )

    if (!products) {
      products = await this.productsRepositories.find()
      await redisCache.save('api-mysales-PRODUCT_LIST', JSON.stringify(products))
    }

    const [data, total] = await this.productsRepositories.findAndCount({
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
    } as IPagination<Product>
  }
}