import AppError from "@shared/errors/AppError";
import { Product } from "../database/entities/Product";
import { productsRepositories } from "../database/repositories/ProductsRepositories";

interface IUpdateProductService {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default class UpdateProductService {
  async execute({
    id,
    name,
    price,
    quantity,
  }: IUpdateProductService): Promise<Product> {
    const product = await productsRepositories.findById(id);

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

    return product;
  }
}
