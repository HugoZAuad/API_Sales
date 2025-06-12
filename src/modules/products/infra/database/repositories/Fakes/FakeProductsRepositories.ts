import { Product } from "@modules/products/infra/database/entities/Product";
import { IProductRepositories, Pagination } from "@modules/products/domain/repositories/ICreateProductRepositories";
import { ICreateProduct } from "@modules/products/domain/models/ICreateProduct";

export default class FakeProductsRepositories implements IProductRepositories {
  private products: Product[] = [];

  public async create(data: ICreateProduct): Promise<Product> {
    const product = new Product();

    product.id = (this.products.length + 1).toString();
    product.name = data.name;
    product.price = data.price;
    product.quantity = data.quantity;
    product.created_at = new Date();
    product.updated_at = new Date();

    this.products.push(product);

    return product;
  }

  public async save(product: Product): Promise<Product> {
    const findIndex = this.products.findIndex(p => p.id === product.id);

    if (findIndex !== -1) {
      this.products[findIndex] = product;
    }

    return product;
  }

  public async remove(product: Product): Promise<void> {
    const index = this.products.findIndex(p => p.id === product.id);
    if (index !== -1) {
      this.products.splice(index, 1);
    }
  }

  public async findById(id: string): Promise<Product | null> {
    const product = this.products.find(p => p.id === id);
    return product || null;
  }

  public async findByName(name: string): Promise<Product | null> {
    const product = this.products.find(p => p.name === name);
    return product || null;
  }

  public async find(): Promise<Product[]> {
    return this.products;
  }

  public async findAndCount(pagination: Pagination): Promise<[Product[], number]> {
    const { skip, take } = pagination;
    const items = this.products.slice(skip, skip + take);
    return [items, this.products.length];
  }

  public async findAllByIds(ids: string[]): Promise<Product[]> {
    const products = this.products.filter(product => ids.includes(product.id));
    return products;
  }
}
