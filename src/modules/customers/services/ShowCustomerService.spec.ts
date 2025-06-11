import AppError from "@shared/errors/AppError"
import FakeCustomerRepositories from "@modules/customers/infra/database/repositories/Fakes/FakeCustomerRepositories"
import ShowCustomerService from "@modules/customers/services/ShowCustomerService"

describe('ShowCustomerService', () => {
  it('Should be able to show an existing customer', async () => {
    const fakeCustomerRepositories = new FakeCustomerRepositories()
    const showCustomer = new ShowCustomerService(fakeCustomerRepositories)

    const customer = await fakeCustomerRepositories.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
    })

    const foundCustomer = await showCustomer.execute({ id: customer.id })

    expect(foundCustomer).toHaveProperty('id')
    expect(foundCustomer.email).toBe('john.doe@example.com')
  })

  it('Should not be able to show a non-existing customer', async () => {
    const fakeCustomerRepositories = new FakeCustomerRepositories()
    const showCustomer = new ShowCustomerService(fakeCustomerRepositories)

    await expect(showCustomer.execute({ id: 9999 })).rejects.toBeInstanceOf(AppError)
  })
})
