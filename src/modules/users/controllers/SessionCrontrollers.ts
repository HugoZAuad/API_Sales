import { Request, Response } from "express";
import SessionUserService from "../services/SessionUserService"
import { instanceToInstance } from "class-transformer"

export default class SessionsControllers {
  async create(request: Request, response: Response): Promise<Response>{
    const{ email, password } = request.body;
    const createSession = new SessionUserService()

    const userToken = await createSession.execute({
      email,
      password,
    })

    return response.json(instanceToInstance(userToken))
  }
}
