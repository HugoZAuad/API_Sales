import AppError from "@shared/errors/AppError"
import { User } from "../database/entities/User"
import { usersRepositories } from "../database/repositories/userRepositories"
import RedisCache from "@shared/cache/RedisCache"

interface IShowProfile {
  user_id: number
}

export default class ShowProfileService {
  async execute({ user_id }: IShowProfile): Promise<User> {
    const user = await usersRepositories.findById(user_id)
    const redisCache = new RedisCache()

    if (!user) {
      throw new AppError("Usuário não encontrado", 404)
    }

    await redisCache.invalidate('api-mysales-USER_LIST')

    return user
  }
}