import AppError from "@shared/errors/AppError"
import { customerRepositories } from "../database/repositories/CustomersRepositories"

interface IDeleteCustomer{
  id: number
}

export default class DeleteCustomerService{
  async execute({id}: IDeleteCustomer): Promise <void>{
    const customer = await customerRepositories.findById(id)

    if(!customer){
      throw new AppError("Clienten não encontrado.", 404)
    }

    await customerRepositories.remove(customer)
  }
}