import { Request, Response } from "express"
import ListUserService from "@modules/users/services/LiserUserService"
import CreateUserService from "@modules/users/services/CreateUserService"
import { instanceToInstance } from "class-transformer"
import { container } from "tsyringe"

export default class UsersControllers {
  async index(request: Request, response: Response): Promise<Response> {
    const page = parseInt(request.query.page as string) || 1
    const limit = parseInt(request.query.limit as string) || 10

    const listUsers = container.resolve(ListUserService)
    const users = await listUsers.execute(page, limit)
    return response.json(instanceToInstance(users))
  }

  async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body
    const createUser = container.resolve(CreateUserService)
    const user = await createUser.execute({ name, email, password })
    return response.json(instanceToInstance(user))
  }
}
