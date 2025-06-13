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
    const redisCache = new RedisCache()

    if (!name || price === undefined || quantity === undefined) {
      throw new AppError("Nome, preço e quantidade são obrigatórios", 400);
    }

    if (price < 0) {
      throw new AppError("Preço não pode ser negativo", 400);
    }

    if (quantity <= 0) {
      throw new AppError("Quantidade deve ser maior que zero", 400);
    }

    const productExists = await this.productsRepositories.findByName(name);

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
