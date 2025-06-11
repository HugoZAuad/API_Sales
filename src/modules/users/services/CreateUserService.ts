import AppError from "@shared/errors/AppError"
import { hash } from "bcrypt"
import RedisCache from "@shared/cache/RedisCache"
import { ICreateUser } from "../domain/models/ICreateUser"
import { IUsersRepositories } from "../domain/repositories/IUsersRepositories"
import { IUser } from "../domain/models/IUser"

export default class CreateUserService {
  constructor(private readonly usersRepositories: IUsersRepositories) {}
  async execute({ name, email, password }: ICreateUser): Promise<IUser> {
    const emailExists = await this.usersRepositories.findByEmail(email)
    const redisCache = new RedisCache()    

    if (emailExists) {
      throw new AppError("Endereço de e-mail já cadastrado", 409)
    }
    const hasedPassword = await hash(password, 10)

    const user = await this.usersRepositories.create({
      name,
      email,
      password: hasedPassword,
    })

    await redisCache.invalidate('api-mysales-USER_LIST')

    return user
  }
}
