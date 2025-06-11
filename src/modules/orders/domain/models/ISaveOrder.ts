import { IOrderProduct } from "./IOrderProduct"

export interface ISaveOrder {
  customer_id: string
  order_products: IOrderProduct[]
}
