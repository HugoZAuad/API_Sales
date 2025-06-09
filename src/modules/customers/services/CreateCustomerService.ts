import AppError from "@shared/errors/AppError"
import { Customer } from "../database/entities/Customers"
import { customerRepositories } from "../database/repositories/CustomersRepositories"

interface ICreateCustomer {
  name: string
  email: string
}

export default class CreateCustomerService {
  async execute({ name, email }: ICreateCustomer): Promise<Customer> {
    const emailExists = await customerRepositories.findByEmail(email)

    if (emailExists) {
      throw new AppError("O endereço de e-mail já esta sendo usado", 409)
    }

    const customer = customerRepositories.create({
      name,
      email,
    })

    await customerRepositories.save(customer)

    return customer
  }
}
