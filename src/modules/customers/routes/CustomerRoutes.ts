import { Router } from 'express'
import CustomerControllers from '../controllers/CustomerControllers'
import AuthMiddleware from '@shared/middlewares/authMiddleware'
import { createCustomerSchema, idParamsValidate, updateCustomerSchema } from '../schemas/CustomerSchemas'

const customerRoutes = Router()
const customerController = new CustomerControllers()

customerRoutes.use(AuthMiddleware.execute)

customerRoutes.get('/', customerController.index)
customerRoutes.get('/:id', idParamsValidate, customerController.show)
customerRoutes.post('/', createCustomerSchema, customerController.create)
customerRoutes.patch('/:id', idParamsValidate, updateCustomerSchema, customerController.update)
customerRoutes.delete('/:id', idParamsValidate, customerController.delete)

export default customerRoutes