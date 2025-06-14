import { AppDataSource } from '@shared/infra/typeorm/data-source'
import { App } from 'supertest/types'
import appPromise from '@shared/infra/http/server'
import request from 'supertest'
import { Server } from 'http'

describe('Criar Pedido', () => {
  let app: App
  let server: Server
  let token: string
  let customerId: string
  let productId: string

  async function createUserAndLogin() {
    await request(app)
      .post('/users')
      .send({
        name: 'Usuário Teste',
        email: 'userorder@test.com',
        password: '123456'
      })

    const login = await request(app)
      .post('/sessions')
      .send({
        email: 'userorder@test.com',
        password: '123456'
      })

    return login.body.token
  }

  async function createCustomer(authToken: string) {
    const customer = await request(app)
      .post('/customers')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ name: 'Cliente Pedido', email: 'pedido@teste.com' })
    return customer.body.id
  }

  async function createProduct(authToken: string) {
    const product = await request(app)
      .post('/products')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ name: 'Produto Pedido', price: 50, quantity: 10 })
    return product.body.id
  }

  async function createOrder(authToken: string, customer_id: string, products: Array<{ product_id: string; quantity: number }>) {
    return await request(app)
      .post('/orders')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        customer_id,
        products
      })
  }

  beforeAll(async () => {
    jest.setTimeout(30000)

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

    token = await createUserAndLogin()
    customerId = await createCustomer(token)
    productId = await createProduct(token)
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

  describe('Order Integration', () => {
    it('deve criar um novo pedido com sucesso', async () => {
      const response = await createOrder(token, String(customerId), [
        { product_id: productId, quantity: 2 }
      ])

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('id')
      expect(response.body.customer.id).toBe(customerId)
      expect(response.body.order_products[0].product_id).toBe(productId)
    })

    describe('Erros ao criar pedido', () => {
      it('deve retornar erro ao criar pedido com cliente inexistente', async () => {
        const response = await createOrder(token, '999999', [
          { product_id: productId, quantity: 2 }
        ])

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('message')
      })

      it('deve retornar erro ao criar pedido com produto inexistente', async () => {
        const response = await createOrder(token, customerId, [
          { product_id: 'produto_inexistente', quantity: 2 }
        ])

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('message')
      })

      it('deve retornar erro ao criar pedido com quantidade indisponível', async () => {
        const response = await createOrder(token, customerId, [
          { product_id: productId, quantity: 999 }
        ])

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('message')
      })

      it('deve retornar erro ao criar pedido com array de produtos vazio', async () => {
        const response = await createOrder(token, customerId, [])

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('message')
      })

      it('deve retornar erro ao criar pedido com dados inválidos', async () => {
        const response = await createOrder(token, '', [{ product_id: '', quantity: -1 }])

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('message')
      })
    })
  })
})
