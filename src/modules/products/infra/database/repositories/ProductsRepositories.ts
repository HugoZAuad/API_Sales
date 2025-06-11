import { AppDataSource } from "@shared/infra/typeorm/data-source"
import { Product } from "../entities/Product"
import { In, Repository } from "typeorm"

import { IProduct } from "@modules/products/domain/models/IProduct"
import { IProductRepositories, Pagination } from "@modules/products/domain/repositories/ICreateProductRepositories"
import { ICreateProduct } from "@modules/products/domain/models/ICreateProduct"

export default class ProductRepositories implements IProductRepositories {
  private ormRepository: Repository<Product>

  constructor() {
    this.ormRepository = AppDataSource.getRepository(Product)
  }
  find(): Promise<IProduct[]> {
    throw new Error("Method not implemented.")
  }
  async findAndCount({take, skip}:Pagination): Promise<[IProduct[], number]> {
    const [product, total] = await this.ormRepository.findAndCount({
      take,
      skip,
    })
    return [product, total]
  }

  async findAllByIds(ids: string[]): Promise<IProduct[]> {
    const existentProducts = await this.ormRepository.find({
      where: { id: In(ids) },
    });
    return existentProducts;
  }

  async findByName(name: string): Promise<IProduct | null> {
    const product = await this.ormRepository.findOneBy({
      name,
    });
    return product;
  }

  async findById(id: string): Promise<IProduct | null> {
    const product = await this.ormRepository.findOneBy({
      id,
    });
    return product;
  }

  async create(data: ICreateProduct): Promise<IProduct> {
    const product = this.ormRepository.create(data);
    await this.ormRepository.save(product);
    return product;
  }

  async save(product: IProduct): Promise<IProduct> {
    await this.ormRepository.save(product);
    return product;
  }

  async remove(product: IProduct): Promise<void> {
    await this.ormRepository.remove(product);
  }
}
