import { Customer } from "../database/entities/Customers"
import { customerRepositories } from "../database/repositories/CustomersRepositories"

export default class ListCustomerService {
  async execute(): Promise<Customer[]> {
    const customer = customerRepositories.find()
    return customer
  }
}