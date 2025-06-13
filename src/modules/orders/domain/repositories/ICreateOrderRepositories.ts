import { ISaveOrder } from '../models/ISaveOrder';
import { IOrder } from "../models/IOrder"

export interface IOrderRepositories {
  create(data: ISaveOrder): Promise<IOrder>
  save(customer: IOrder): Promise<IOrder>
  findById(id: number): Promise<IOrder | null>
  findAll(params: { skip: number; take: number }): Promise<IOrder[]>
}
