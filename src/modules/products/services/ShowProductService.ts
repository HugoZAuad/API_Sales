import { Product } from '../infra/database/entities/Product'
import AppError from '@shared/errors/AppError'
import { productsRepositories } from '../infra/database/repositories/ProductsRepositories'
import RedisCache from '@shared/cache/RedisCache'
import { IShowProduct } from '../domain/models/IShowProduct'

export default class ShowProductService {
  async execute({ id }: IShowProduct): Promise<Product> {
    const product = await productsRepositories.findById(id)
    const redisCache = new RedisCache()

    if (!product) {
      throw new AppError('Produto não encontrado', 404)
    }

    await redisCache.invalidate('api-mysales-PRODUCT_LIST')

    return product
  }
}
