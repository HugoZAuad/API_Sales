import { Request, Response } from "express"
import ListUserService from "../services/LiserUserService"
import CreateUserService from "../services/CreateUserService"
import { instanceToInstance } from "class-transformer"

export default class UsersControllers {
  async index(request: Request, response: Response): Promise<Response> {
    const page = parseInt(request.query.page as string) || 1
    const limit = parseInt(request.query.limit as string) || 10

    const listUsers = new ListUserService()
    const users = await listUsers.execute(page, limit)
    return response.json(instanceToInstance(users))
  }

  async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body
    const createUser = new CreateUserService()
    const user = await createUser.execute({ name, email, password })
    return response.json(instanceToInstance(user))
  }
}
