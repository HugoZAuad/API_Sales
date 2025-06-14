import { AppDataSource } from '@shared/infra/typeorm/data-source'
import { App } from 'supertest/types'
import appPromise from '@shared/infra/http/server'
import request from 'supertest'
import { Server } from 'http'

describe('Criar cliente', () => {
  let app: App
  let server: Server
  let token: string

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

    await request(app)
      .post("/users")
      .send({ name: "Teste", email: "teste@teste.com", password: "123456" });

    const loginResponse = await request(app)
      .post("/sessions")
      .send({ email: "teste@teste.com", password: "123456" });

    token = loginResponse.body.token;
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

  describe("Customer Integration", () => {
    it("deve criar um novo cliente", async () => {
      const response = await request(app)
        .post("/customers")
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: "Cliente Teste",
          email: "cliente@teste.com",
        })

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty("id")
      expect(response.body.name).toBe("Cliente Teste")
    })

    it("deve retornar erro ao criar cliente com email inválido", async () => {
      const response = await request(app)
        .post("/customers")
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: "Cliente Teste",
          email: "emailinvalido",
        })

      expect(response.status).toBe(400)
    })
  })
})