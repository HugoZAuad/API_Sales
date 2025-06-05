import { User } from "../database/entities/User"
import { usersRepositories } from "../database/repositories/userRepositories"

export default class ListUserService {
  async execute(): Promise<User[]>{
    const users = await usersRepositories.find();
    return users;
  }
}