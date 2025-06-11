import AppError from "@shared/errors/AppError"
import { User } from "../infra/database/entities/User"
import RedisCache from "@shared/cache/RedisCache"
import { IShowProfile } from "../domain/models/IShowProfile"
import { IUsersRepositories } from "../domain/repositories/IUsersRepositories"
import { injectable, inject } from "tsyringe"

@injectable()
export default class ShowProfileService {
  constructor(@inject('usersRepositories')
  private readonly usersRepositories: IUsersRepositories) {}
  async execute({ user_id }: IShowProfile): Promise<User> {
    const user = await this.usersRepositories.findById(user_id)
    const redisCache = new RedisCache()

    if (!user) {
      throw new AppError("Usuário não encontrado", 404)
    }

    await redisCache.invalidate('api-mysales-USER_LIST')

    return user
  }
}