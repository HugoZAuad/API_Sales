import AppError from "@shared/errors/AppError";
import { Product } from "../infra/database/entities/Product";
import RedisCache from "@shared/cache/RedisCache"
import { IUpdateProductService } from "../domain/models/IUpdateProductService"
import { IProductRepositories } from "../domain/repositories/ICreateProductRepositories"



export default class UpdateProductService {
  constructor(private readonly productsRepositories: IProductRepositories) {}
  async execute({
    id,
    name,
    price,
    quantity,
  }: IUpdateProductService): Promise<Product> {
    const product = await this.productsRepositories.findById(id);
    const redisCache = new RedisCache()

    if (!product) {
      throw new AppError("Produto não encontrado", 404);
    }

    const productExists = await this.productsRepositories.findByName(name);

    if (productExists) {
      throw new AppError("Já existe um produto com esse nome", 409);
    }

    product.name = name;
    product.price = price;
    product.quantity = quantity;

    await this.productsRepositories.save(product)

    await redisCache.invalidate('api-mysales-PRODUCT_LIST')

    return product;
  }
}
