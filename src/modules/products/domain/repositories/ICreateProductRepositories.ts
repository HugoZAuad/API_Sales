import { IProduct } from './../models/IProduct';
import { ICreateProduct } from "../models/ICreateProduct";

export interface Pagination {
  take: number;
  skip: number;
}

export interface IProductRepositories {
  findAllByIds(ids: string[]): Promise<IProduct[]>;
  create(data: ICreateProduct): Promise<IProduct>;
  save(product: IProduct): Promise<IProduct>;
  remove(product: IProduct): Promise<void>;
  findById(id: string): Promise<IProduct | null>;
  findByName(name: string): Promise<IProduct | null>;
  find(): Promise<IProduct[]>;
  findAndCount(pagination: Pagination): Promise<[IProduct[], number]>;
}
