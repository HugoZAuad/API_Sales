import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { Order } from "./orders"
import { Product } from "@modules/products/database/entities/Product"

@Entity('orders_products')
export class OrdersProducts {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Order, order => order.order_products)
  @JoinColumn({ name: 'order_id' })
  order: Order

  @ManyToOne(() => Product, product => product.order_products)
  @JoinColumn({ name: 'order_id' })
  products: Product

  @Column('decimal')
  price: number

  @Column('int')
  quantity: number

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  update_ate: Date
}