import AppError from "@shared/errors/AppError"
import { User } from "../infra/database/entities/User"
import { usersRepositories } from "../infra/database/repositories/userRepositories"
import { compare, hash } from "bcrypt"
import RedisCache from "@shared/cache/RedisCache"

interface IUpdateProfile {
  user_id: number,
  name: string,
  email: string,
  password: string,
  old_password: string,
}

export default class UpdateProfileService {
  async execute({ user_id, name, email, password, old_password, }: IUpdateProfile): Promise<User> {
    const user = await usersRepositories.findById(user_id)
    const redisCache = new RedisCache()

    if (!user) {
      throw new AppError("Usuario não existe", 404)
    }

    if (email) {
      const userUpdateEmail = await usersRepositories.findByEmail(email)
      if (userUpdateEmail) {
        throw new AppError("Já existe um usuario com este e-mail.", 409)
      }

      user.email = email
    }

    if (password && !old_password) {
      throw new AppError('O antigo password precisa ser informado.')
    }

    if (password && !old_password) {
      const checkOldPassword = await compare(old_password, user.password)

      if (!checkOldPassword) {
        throw new AppError("O antigo password não esta correto")
      }

      user.password = await hash(password, 10)
    }

    if (name) {
      user.name = name
    }

    await usersRepositories.save(user)

    await redisCache.invalidate('api-mysales-USER_LIST')

    return user
  }
}
