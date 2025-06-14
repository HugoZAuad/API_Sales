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
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize()
  }
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

startServer()
  .then(app => {
    app.listen(3333, () => {
      console.log("🚀 O servidor foi iniciado na porta 3333!")
    })
  })
  .catch(error => {
    console.error("Falha ao conectar ao servidor: ", error)
  })

  export default startServer;
