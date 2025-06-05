import { Request, Response } from 'express'
import ListUserService from '../services/LiserUserService'
import CreateUserService from '../services/CreateUserService'

export default class UsersControllers {
  async index(request: Request, response: Response): Promise<Response>{
    const listUsers = new ListUserService()
    const users = await listUsers.execute()
    return response.json(users)
  }

  async create(request: Request, response: Response): Promise<Response>{
    const {name, email, password} = request.body;
    const createUser = new CreateUserService()
    const user = await createUser.execute({name, email, password})
    return response.json(user)
  }
}