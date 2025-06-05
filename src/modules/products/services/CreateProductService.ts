import { Product } from "./../database/entities/Product";
import { productsRepositories } from "../database/repositories/ProductsRepositories";
import AppError from "@shared/errors/AppError";

interface ICreateProduct {
  name: string;
  price: number;
  quantity: number;
}

export default class CreateProductService {
  async execute({ name, price, quantity }: ICreateProduct): Promise<Product> {
    const productExists = await productsRepositories.findByName(name);

    if (productExists) {
      throw new AppError("Já existe um produto com esse nome", 409);
    }

    const product = productsRepositories.create({
      name,
      price,
      quantity,
    });

    await productsRepositories.save(product)

    return product;
  }
}
