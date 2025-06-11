import { Product } from "../infra/database/entities/Product";
import { productsRepositories } from "../infra/database/repositories/ProductsRepositories";
import AppError from "@shared/errors/AppError";
import RedisCache from "@shared/cache/RedisCache"

interface ICreateProduct {
  name: string;
  price: number;
  quantity: number;
}

export default class CreateProductService {
  async execute({ name, price, quantity }: ICreateProduct): Promise<Product> {
    const productExists = await productsRepositories.findByName(name);
    const redisCache = new RedisCache()

    if (productExists) {
      throw new AppError("Já existe um produto com esse nome", 409);
    }

    const product = productsRepositories.create({
      name,
      price,
      quantity,
    });

    await productsRepositories.save(product)
    
    await redisCache.invalidate('api-mysales-PRODUCT_LIST')

    return product;
  }
}
