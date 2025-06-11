import AppError from "@shared/errors/AppError"
import { User } from "../infra/database/entities/User"
import path from "path"
import uploadConfig from "@config/Upload"
import fs from "fs"
import RedisCache from "@shared/cache/RedisCache"
import { IUpdateUserAvatar } from "../domain/models/IUpdateUserAvatar"
import { IUsersRepositories } from "../domain/repositories/IUsersRepositories"

export default class UpdateUserAvatarService {
  constructor(private readonly usersRepositories: IUsersRepositories) {}
  async execute({ userId, avatarFileName }: IUpdateUserAvatar): Promise<User> {
    const user = await this.usersRepositories.findById(userId)
    const redisCache = new RedisCache()

    if (!user) {
      throw new AppError("Usuario não encontrado", 404)
    }

    if (user.avatar) {
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar)
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath)

      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath)
      }
    }

    user.avatar = avatarFileName
    await this.usersRepositories.save(user)

    await redisCache.invalidate('api-mysales-USER_LIST')
    
    return user
  }
}
