import { AppDataSource } from '@shared/infra/typeorm/data-source'
import { App } from 'supertest/types'
import appPromise from '@shared/infra/http/server'
import request from 'supertest'
import { Server } from 'http'

describe('Create User', () => {
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
    } else {
      throw new Error('appInstance does not have a listen method')
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

  it('Deve ser capaz de criar um novo usuario', async () => {
    const response = await request(app).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('id')
    expect(response.body.email).toBe('johndoe@example.com')
  })

  it('Não deve ser capaz de criar um novo usuario com email ja existente', async () => {
    await request(app).post('/users').send({
      name: 'John Doe',
      email: 'johndoeduplicate@example.com',
      password: '123456'
    })

    const response = await request(app).post('/users').send({
      name: 'Jane Doe',
      email: 'johndoeduplicate@example.com',
      password: '324562321'
    })

    expect(response.status).toBe(409)
    expect(response.body).toHaveProperty(
      'message',
      'Endereço de e-mail já cadastrado'
    )
  })
})
