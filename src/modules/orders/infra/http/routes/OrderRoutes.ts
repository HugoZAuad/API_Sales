import { Router } from 'express'
import OrdersControllers from '../controllers/OrdersControllers'
import AuthMiddleware from '@shared/middlewares/authMiddleware'
import { createOrderValidate, isParamsValidate } from '../schemas/OrdersSchemas'

const ordersRouter = Router()
const orderControllers = new OrdersControllers()

ordersRouter.use(AuthMiddleware.execute)

ordersRouter.get('/:id', isParamsValidate, orderControllers.show)
ordersRouter.post('/', createOrderValidate, orderControllers.create)

export default ordersRouter
