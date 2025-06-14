import { Order } from "../infra/database/entities/Orders";
import AppError from "@shared/errors/AppError";
import RedisCache from "@shared/cache/RedisCache";
import { ISaveOrder } from "../domain/models/ISaveOrder";
import { IProductRepositories } from "@modules/products/domain/repositories/ICreateProductRepositories";
import { ICustomerRepositories } from "@modules/customers/domain/repositories/ICreateCustomerRepositories";
import { IOrderRepositories } from "../domain/repositories/ICreateOrderRepositories";
import { injectable, inject } from "tsyringe"

@injectable()
export class CreateOrderService {
  constructor(
    @inject('productRepositories')
    private readonly productRepositories: IProductRepositories,
    @inject('customerRepositories')
    private readonly customerRepositories: ICustomerRepositories,
    @inject('orderRepositories')
    private readonly orderRepositories: IOrderRepositories
  ) {}

  async execute({ customer_id, order_products }: ISaveOrder): Promise<Order> {
    const customerExists = await this.customerRepositories.findById(Number(customer_id));
    const redisCache = new RedisCache();

    if (!customerExists) {
      throw new AppError("O cliente não foi localizado");
    }

    const existsProducts = await this.productRepositories.findAllByIds(
      order_products.map((product: { product_id: string }) => product.product_id)
    );
    if (!existsProducts.length) {
      throw new AppError("Não foi possivel encontrar os produtos solicitados");
    }

    const existsProductsIds = existsProducts.map(product => product.id);
    const checkInexistentProducts = order_products.filter(
      (product: { product_id: string }) => !existsProductsIds.includes(product.product_id)
    );
    if (checkInexistentProducts.length) {
      throw new AppError(`Produto ${checkInexistentProducts[0].product_id} não encontrado`, 404);
    }

    const quantityAvailable = order_products.filter(
      (product: { product_id: string; quantity: number }) => {
        return (
          existsProducts.filter(productExistent => productExistent.id === product.product_id)[0]
            .quantity < product.quantity
        );
      }
    );
    if (quantityAvailable.length) {
      throw new AppError(`A quantidade não está disponivel para o produto`, 409);
    }

    const orderProductsWithPrice = order_products.map(product => {
      const productData = existsProducts.find(p => p.id === product.product_id);
      return {
        product_id: product.product_id,
        quantity: product.quantity,
        price: productData ? productData.price : 0,
      };
    });

    const order = await this.orderRepositories.create({
      customer_id: customerExists.id.toString(),
      customer: customerExists,
      order_products: orderProductsWithPrice,
    });

    const updateProductQuantity = order.order_products.map(
      (product: { product_id: string; quantity: number }) => ({
        id: product.product_id,
        quantity:
          existsProducts.filter(p => p.id === product.product_id)[0].quantity - product.quantity,
      })
    );

    for (const product of updateProductQuantity) {
      await this.productRepositories.save({
        id: product.id,
        name: existsProducts.find(p => p.id === product.id)?.name || '',
        price: existsProducts.find(p => p.id === product.id)?.price || 0,
        quantity: product.quantity,
        order_products: [],
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    await redisCache.invalidate("api-mysales-ORDER_LIST");

    return order;
  }
}
