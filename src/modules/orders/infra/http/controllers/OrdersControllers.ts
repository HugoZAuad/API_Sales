import { Request, Response } from "express";
import { ShowOrderService } from "@modules/orders/services/ShowOrderService"
import { CreateOrderService } from "@modules/orders/services/CreateOrderService"
import ListOrderService from "@modules/orders/services/ListOrderService"
import { container } from "tsyringe"

export default class OrdersControllers{
  async show(request: Request, response: Response): Promise <Response>{
    const {id} = request.params
    const showOrder = container.resolve(ShowOrderService) 
    const order = await showOrder.execute(id)

    return response.json(order)
  }

  async create(request: Request, response: Response): Promise <Response>{
    const {customer_id, products} = request.body
    const createOrder = container.resolve(CreateOrderService)
    const order = await createOrder.execute({
      customer_id,
      order_products: products
    })

    return response.json(order)
  }

  async list(request: Request, response: Response): Promise<Response> {
    const { page = 1, limit = 10 } = request.query

    const listOrder = container.resolve(ListOrderService)
    const orders = await listOrder.execute({
      page: Number(page),
      limit: Number(limit),
    })

    return response.json(orders)
  }
}
