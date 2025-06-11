import { Product } from '../infra/database/entities/Product'
import AppError from '@shared/errors/AppError'
import RedisCache from '@shared/cache/RedisCache'
import { IShowProduct } from '../domain/models/IShowProduct'
import { IProductRepositories } from '../domain/repositories/ICreateProductRepositories'
import { injectable, inject } from 'tsyringe'

@injectable()
export default class ShowProductService {
  constructor(@inject('productRepositories') private readonly productsRepositories: IProductRepositories) {}
  async execute({ id }: IShowProduct): Promise<Product> {
    const product = await this.productsRepositories.findById(id)
    const redisCache = new RedisCache()

    if (!product) {
      throw new AppError('Produto não encontrado', 404)
    }

    await redisCache.invalidate('api-mysales-PRODUCT_LIST')

    return product
  }
}
