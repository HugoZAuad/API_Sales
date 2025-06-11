import AppError from "@shared/errors/AppError"
import { User } from "../infra/database/entities/User"
import { usersRepositories } from "../infra/database/repositories/userRepositories"
import { hash } from "bcrypt"
import RedisCache from "@shared/cache/RedisCache"
import { ICreateUser } from "../domain/models/ICreateUser"

export default class CreateUserService {
  async execute({ name, email, password }: ICreateUser): Promise<User> {
    const emailExists = await usersRepositories.findByEmail(email)
    const redisCache = new RedisCache()    

    if (emailExists) {
      throw new AppError("Endereço de e-mail já cadastrado", 409)
    }
    const hasedPassword = await hash(password, 10)

    const user = usersRepositories.create({
      name,
      email,
      password: hasedPassword,
    })

    await usersRepositories.save(user)

    await redisCache.invalidate('api-mysales-USER_LIST')

    return user
  }
}
