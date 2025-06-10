import { IPagination } from "@shared/interfaces/PaginationInterface"
import { Product } from "../database/entities/Product"
import { productsRepositories } from "../database/repositories/ProductsRepositories"

export default class ListProductService {
  async execute(page: number = 1, limit: number = 10): Promise<IPagination<Product>> {
    const [data, total] = await productsRepositories.findAndCount({
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
        } as IPagination<Product>;
  }
}