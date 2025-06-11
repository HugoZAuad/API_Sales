import { Router } from 'express'
import SessionsControllers from '../controllers/SessionCrontrollers'
import { sessionSchema } from '../schemas/SessionSchemas'

const sessionsRouter = Router()
const sessionsControllers = new SessionsControllers()

sessionsRouter.post ('/', sessionSchema, sessionsControllers.create)

export default sessionsRouter