import AppError from "@shared/errors/AppError"
import FakeCustomerRepositories from "@modules/customers/infra/database/repositories/Fakes/FakeCustomerRepositories"
import CreateCustomerService from "@modules/customers/services/CreateCustomerService"

describe('CreateCustomerService', () => {
  it('Should be able to create a new customer', async () => {
    const fakeCustomerRepositories = new FakeCustomerRepositories()
    const createCustomer = new CreateCustomerService(fakeCustomerRepositories)

    const customer = await createCustomer.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
    })

    expect(customer).toHaveProperty('id')
    expect(customer.email).toBe('john.doe@example.com')
  })

  it('Should note be able to create a new customer with email that is already in use', async () => {
    const fakeCustomerRepositories = new FakeCustomerRepositories()
    const createCustomer = new CreateCustomerService(fakeCustomerRepositories)

    await createCustomer.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
    })

    await expect(
      createCustomer.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
    })
    ).rejects.toBeInstanceOf(AppError)
  })
})