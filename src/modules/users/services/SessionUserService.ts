import AppError from "@shared/errors/AppError"
import { User } from "../database/entities/User"
import { usersRepositories } from "../database/repositories/userRepositories"
import { compare } from "bcrypt"
import { Secret, sign } from "jsonwebtoken"
import RedisCache from "@shared/cache/RedisCache"

interface ISessionUser {
  email: string
  password: string
}

interface ISesssionResponse {
  user: User
  token: string
}

export default class SessionUserService {
  async execute({ email, password }: ISessionUser): Promise<ISesssionResponse> {
    const user = await usersRepositories.findByEmail(email)
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
