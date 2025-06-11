import AppError from "@shared/errors/AppError"
import FakeCustomerRepositories from "@modules/customers/infra/database/repositories/Fakes/FakeCustomerRepositories"
import UpdateCustomerService from "@modules/customers/services/UpdateCustomerService"

describe('UpdateCustomerService', () => {
  it('Should be able to update an existing customer', async () => {
    const fakeCustomerRepositories = new FakeCustomerRepositories()
    const updateCustomer = new UpdateCustomerService(fakeCustomerRepositories)

    const customer = await fakeCustomerRepositories.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
    })

    const updatedCustomer = await updateCustomer.execute({
      id: customer.id,
      name: 'John Updated',
      email: 'john.updated@example.com',
    })

    expect(updatedCustomer.name).toBe('John Updated')
    expect(updatedCustomer.email).toBe('john.updated@example.com')
  })

  it('Should not be able to update a non-existing customer', async () => {
    const fakeCustomerRepositories = new FakeCustomerRepositories()
    const updateCustomer = new UpdateCustomerService(fakeCustomerRepositories)

    await expect(
      updateCustomer.execute({
        id: 9999,
        name: 'John Updated',
        email: 'john.updated@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })

  it('Should not be able to update to an email that is already in use', async () => {
    const fakeCustomerRepositories = new FakeCustomerRepositories()
    const updateCustomer = new UpdateCustomerService(fakeCustomerRepositories)

    await fakeCustomerRepositories.create({
      name: 'Existing User',
      email: 'existing@example.com',
    })

    const customer = await fakeCustomerRepositories.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
    })

    await expect(
      updateCustomer.execute({
        id: customer.id,
        name: 'John Updated',
        email: 'existing@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError)
  })
})
