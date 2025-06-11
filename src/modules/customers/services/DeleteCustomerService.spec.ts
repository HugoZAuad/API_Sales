import AppError from "@shared/errors/AppError"
import FakeCustomerRepositories from "@modules/customers/infra/database/repositories/Fakes/FakeCustomerRepositories"
import DeleteCustomerService from "@modules/customers/services/DeleteCustomerService"

describe('DeleteCustomerService', () => {
  it('Should be able to delete an existing customer', async () => {
    const fakeCustomerRepositories = new FakeCustomerRepositories()
    const deleteCustomer = new DeleteCustomerService(fakeCustomerRepositories)

    const customer = await fakeCustomerRepositories.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
    })

    await expect(deleteCustomer.execute({ id: customer.id })).resolves.toBeUndefined()
  })

  it('Should not be able to delete a non-existing customer', async () => {
    const fakeCustomerRepositories = new FakeCustomerRepositories()
    const deleteCustomer = new DeleteCustomerService(fakeCustomerRepositories)

    await expect(deleteCustomer.execute({ id: 9999 })).rejects.toBeInstanceOf(AppError)
  })
})
