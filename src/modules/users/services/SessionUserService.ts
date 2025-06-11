import AppError from "@shared/errors/AppError"
import { compare } from "bcrypt"
import { Secret, sign } from "jsonwebtoken"
import RedisCache from "@shared/cache/RedisCache"
import { ISessionUser } from "../domain/models/ISessionUser"
import { ISesssionResponse } from "../domain/models/ISesssionResponse"
import { IUsersRepositories } from "../domain/repositories/IUsersRepositories"
import { injectable, inject } from "tsyringe"

@injectable()
export default class SessionUserService {
  constructor(@inject('usersRepositories')
    private readonly usersRepositories: IUsersRepositories) {}
  async execute({ email, password }: ISessionUser): Promise<ISesssionResponse> {
    const user = await this.usersRepositories.findByEmail(email)
    const redisCache = new RedisCache()

    if (!user) {
      throw new AppError("E-mail ou senha errados", 401)
    }

    const passwordConfirmed = await compare(password, user.password)

    if (!passwordConfirmed) {
      throw new AppError("E-mail ou senha errados", 401)
    }

    const token = sign({}, process.env.APP_SECRET as Secret, {
      subject: String(user.id),
      expiresIn: "1d",
    })

    await redisCache.invalidate('api-mysales-USER_LIST')

    return { user, token }
  }
}
