import AppError from "@shared/errors/AppError"
import { Customer } from "../database/entities/Customers"
import { customerRepositories } from "../database/repositories/CustomersRepositories"

interface IShowCustomer {
  id: number
}

export default class ShowCustomerService {
  async execute({id}: IShowCustomer): Promise <Customer>{
    const customer = await customerRepositories.findById(id);
    if(!customer) {
      throw new AppError("Cliente não encontrado", 404)
    }

    return customer
  }
}