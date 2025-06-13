import { AppDataSource } from '@shared/infra/typeorm/data-source'
import { App } from 'supertest/types'
import appPromise from '@shared/infra/http/server'
import request from 'supertest'
import { Server } from 'http'

describe('Criar order', () => {
  let app: App
  let server: Server

  beforeAll(async () => {
    if (!AppDataSource.isInitialized) {
      try {
        await AppDataSource.initialize()
      } catch (error) {
        if (!AppDataSource.isInitialized) {
          throw error
        }
      }
    }
    const appInstance = await appPromise()
    app = appInstance as App
    if (typeof appInstance.listen === 'function') {
      server = appInstance.listen()
    }
  })

  afterAll(async () => {
    if (server) {
      await new Promise<void>((resolve, reject) => {
        server.close((err?: Error) => {
          if (err) reject(err)
          else resolve()
        })
      })
    }

    const entities = AppDataSource.entityMetadatas

    for (const entity of entities) {
      const repository = AppDataSource.getRepository(entity.name)
      await repository.query(`DELETE FROM ${entity.tableName}`)
    }
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy()
    }
  })

  describe("Order Integration", () => {
    let customerId: string
    let productId: string

    beforeAll(async () => {
      const customer = await request(app)
        .post("/customers")
        .send({ name: "Cliente Pedido", email: "pedido@teste.com" })
      customerId = customer.body.id

      const product = await request(app)
        .post("/products")
        .send({ name: "Produto Pedido", price: 50, quantity: 100 })
      productId = product.body.id
    })

    it("deve criar um novo pedido", async () => {
      const response = await request(app)
        .post("/orders")
        .send({
          customer_id: customerId,
          order_products: [
            { product_id: productId, quantity: 2 }
          ]
        })

      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty("id")
      expect(response.body.customer.id).toBe(customerId)
      expect(response.body.order_products[0].product_id).toBe(productId)
    })

    it("deve retornar erro ao criar pedido com cliente inexistente", async () => {
      const response = await request(app)
        .post("/orders")
        .send({
          customer_id: "999999",
          order_products: [
            { product_id: productId, quantity: 2 }
          ]
        })

      expect(response.status).toBe(401)
    })
  })
})