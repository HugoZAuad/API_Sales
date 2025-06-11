import AppError from "@shared/errors/AppError";
import { Product } from "../infra/database/entities/Product";
import { productsRepositories } from "../infra/database/repositories/ProductsRepositories";
import RedisCache from "@shared/cache/RedisCache"
import { IUpdateProductService } from "../domain/models/IUpdateProductService"



export default class UpdateProductService {
  async execute({
    id,
    name,
    price,
    quantity,
  }: IUpdateProductService): Promise<Product> {
    const product = await productsRepositories.findById(id);
    const redisCache = new RedisCache()

    if (!product) {
      throw new AppError("Produto não encontrado", 404);
    }

    const productExists = await productsRepositories.findByName(name);

    if (productExists) {
      throw new AppError("Já existe um produto com esse nome", 409);
    }

    product.name = name;
    product.price = price;
    product.quantity = quantity;

    await productsRepositories.save(product)

    await redisCache.invalidate('api-mysales-PRODUCT_LIST')

    return product;
  }
}
