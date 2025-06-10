import { Product } from './../../../products/database/entities/Product';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { Order } from './Orders'

@Entity('orders_products')
export class OrdersProducts {
  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(() => Order, order => order.order_products)
  @JoinColumn({ name: 'order_id' })
  order: Order

  @Column()
  order_id: string

  @ManyToOne(() => Product, product => product.order_products)
  @JoinColumn({ name: 'order_id' })
  products: Product

  @Column()
  Product_id: string

  @Column('decimal')
  price: number

  @Column('int')
  quantity: number

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  update_ate: Date
}