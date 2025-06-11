import { Router } from 'express'
import ProfileControllers from '../controllers/ProfileControllers'
import { UpdateUserSchema } from '../schemas/UpdateUserSchema'
import AuthMiddleware from '@shared/middlewares/authMiddleware'

const profileRouter = Router()
const profileController = new ProfileControllers()

profileRouter.use(AuthMiddleware.execute)
profileRouter.get('/', profileController.show)
profileRouter.patch('/', UpdateUserSchema, profileController.update)

export default profileRouter