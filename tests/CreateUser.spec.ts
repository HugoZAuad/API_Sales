import { AppDataSource } from '@shared/infra/typeorm/data-source'
import { App } from 'supertest/types'
import appPromise from '@shared/infra/http/server'
import request from 'supertest'

describe('Create User', () => {
  let app: App

  beforeAll(async () => {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize()
    }
    app = (await appPromise) as App
  })

  afterAll(async () => {
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
