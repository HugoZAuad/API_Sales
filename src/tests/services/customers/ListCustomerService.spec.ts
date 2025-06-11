import FakeCustomerRepositories from "../domain/repositories/fakes/FakeCustomerRepositories"
import ListCustomerService from "./ListCustomerService"

describe('ListCustomerService', () => {
  it('Should be able to list customers with pagination', async () => {
    const fakeCustomerRepositories = new FakeCustomerRepositories()
    const listCustomer = new ListCustomerService(fakeCustomerRepositories)

    // Create some customers
    await fakeCustomerRepositories.create({ name: 'John Doe', email: 'john.doe@example.com' })
    await fakeCustomerRepositories.create({ name: 'Jane Doe', email: 'jane.doe@example.com' })

    const result = await listCustomer.execute(1, 10)

    expect(result).toHaveProperty('data')
    expect(result.data.length).toBeGreaterThan(0)
    expect(result).toHaveProperty('total')
    expect(result).toHaveProperty('per_page')
    expect(result).toHaveProperty('current_Page')
    expect(result).toHaveProperty('total_pages')
  })
})
