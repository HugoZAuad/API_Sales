import { Request, Response } from "express";
import SessionUserService from "@modules/users/services/SessionUserService"
import { instanceToInstance } from "class-transformer"
import { container } from "tsyringe"

export default class SessionsControllers {
  async create(request: Request, response: Response): Promise<Response>{
    const{ email, password } = request.body;
    const createSession = container.resolve(SessionUserService)

    const userToken = await createSession.execute({
      email,
      password,
    })

    return response.json(instanceToInstance(userToken))
  }
}
