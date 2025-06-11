import AppError from "@shared/errors/AppError"
import { User } from "../infra/database/entities/User"
import { usersRepositories } from "../infra/database/repositories/userRepositories"
import RedisCache from "@shared/cache/RedisCache"
import { IShowProfile } from "../domain/models/IShowProfile"

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