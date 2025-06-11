import { Customer } from "@modules/customers/infra/database/entities/Customers"
import { OrdersProducts } from "@modules/orders/infra/database/entities/OrdersProducts"

export interface IOrder {
  id: number
  customer: Customer
  order_products: OrdersProducts[]
  created_at: Date
  updated_at: Date
}