import "reflect-metadata"
import "express-async-errors"
import express from "express"
import cors from "cors"
import { errors } from "celebrate"
import '@shared/container'

import routes from "./routes"
import ErrorHandleMiddleware from "@shared/middlewares/ErrorHandleMiddleware"
import { AppDataSource } from "@shared/infra/typeorm/data-source"
import rateLimiter from "@shared/middlewares/RateLimiter"

const startServer = async () => {
  await AppDataSource.initialize()
  const app = express()

  app.use(cors())
  app.use(express.json())

  app.use(rateLimiter)
  app.use(routes)
  app.use(errors())
  app.use(ErrorHandleMiddleware.handleError)

  console.log("Conectando ao servidor!")

  return app
}

export default startServer
