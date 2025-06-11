import { Customer } from "@modules/customers/infra/database/entities/Customers"
import { ICreateOrderProducts } from "@modules/orders/domain/models/ICreateOrderProducts"

export interface ICreateOrder{
  customer: Customer
  products: ICreateOrderProducts[]
}