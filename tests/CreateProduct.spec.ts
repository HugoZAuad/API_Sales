import { AppDataSource } from '@shared/infra/typeorm/data-source'
import { App } from 'supertest/types'
import appPromise from '@shared/infra/http/server'
import request from 'supertest'
import { Server } from 'http'

describe('Criar produto', () => {
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

  it("deve criar um novo produto", async () => {
    const response = await request(app)
      .post("/products")
      .send({
        name: "Produto Teste",
        price: 99.99,
        quantity: 10,
      })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty("id")
    expect(response.body.name).toBe("Produto Teste")
  })

  it("deve retornar erro ao criar produto sem nome", async () => {
    const response = await request(app)
      .post("/products")
      .send({
        price: 99.99,
        quantity: 10,
      })

    expect(response.status).toBe(400)
  })
})