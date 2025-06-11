import { Product } from "../infra/database/entities/Product";
import AppError from "@shared/errors/AppError";
import RedisCache from "@shared/cache/RedisCache"
import { ICreateProduct } from "../domain/models/ICreateProduct"
import { IProductRepositories } from "../domain/repositories/ICreateProductRepositories"
import { injectable, inject } from "tsyringe"

@injectable()
export default class CreateProductService {
  constructor(@inject('productRepositories') private readonly productsRepositories: IProductRepositories) {}
  async execute({ name, price, quantity }: ICreateProduct): Promise<Product> {
    const productExists = await this.productsRepositories.findByName(name);
    const redisCache = new RedisCache()

    if (productExists) {
      throw new AppError("Já existe um produto com esse nome", 409);
    }

    const product = await this.productsRepositories.create({
      name,
      price,
      quantity,
    });

    await redisCache.invalidate('api-mysales-PRODUCT_LIST')

    return product;
  }
}
