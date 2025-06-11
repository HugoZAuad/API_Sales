import AppError from "@shared/errors/AppError"
import RedisCache from "@shared/cache/RedisCache"
import { IDeleteProduct } from "../domain/models/IDeleteProduct"
import { IProductRepositories } from "../domain/repositories/ICreateProductRepositories"
import { injectable, inject } from "tsyringe"

@injectable()
export default class DeleteProductService {
  constructor(@inject('productRepositories') private readonly productsRepositories: IProductRepositories) {}
  async execute({ id }: IDeleteProduct): Promise<void> {
    const product = await this.productsRepositories.findById(id)
    const redisCache = new RedisCache()

    if (!product) {
      throw new AppError("Produto não encontrado", 404)
    }

    await redisCache.invalidate('api-mysales-PRODUCT_LIST')

    await this.productsRepositories.remove(product)
  }
}