import { ICustomerRepositories } from '@modules/customers/domain/repositories/ICreateCustomerRepositories'
import customerRepositories from '@modules/customers/infra/database/repositories/CustomersRepositories'
import { IOrderRepositories } from '@modules/orders/domain/repositories/ICreateOrderRepositories'
import orderRepositories from '@modules/orders/infra/database/repositories/OrderRepositories'
import { IProductRepositories } from '@modules/products/domain/repositories/ICreateProductRepositories'
import productRepositories from '@modules/products/infra/database/repositories/ProductsRepositories'
import { IUsersRepositories } from '@modules/users/domain/repositories/IUsersRepositories'
import UsersRepositories from '@modules/users/infra/database/repositories/UserRepositories'
import { container } from 'tsyringe'

container.registerSingleton<ICustomerRepositories>(
  'customerRepositories', customerRepositories
)

container.registerSingleton<IOrderRepositories>(
  'orderRepositories', orderRepositories
)

container.registerSingleton<IProductRepositories>(
  'productRepositories', productRepositories
)

container.registerSingleton<IUsersRepositories>(
  'usersRepositories', UsersRepositories
)