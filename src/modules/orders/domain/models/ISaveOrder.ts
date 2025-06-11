export interface IOrderProduct {
  product_id: string
  price: number
  quantity: number
}

export interface ISaveOrder {
  customer_id: string
  order_products: IOrderProduct[]
}
