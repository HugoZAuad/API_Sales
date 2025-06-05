import AppError from "@shared/errors/AppError";
import { User } from "../database/entities/User";
import { usersRepositories } from "../database/repositories/userRepositories";
import { hash } from "bcrypt";

interface ICreateUser {
  name: string;
  email: string;
  password: string;
}

export default class CreateUserService {
  async execute({ name, email, password }: ICreateUser): Promise<User> {
    const emailExists = await usersRepositories.findByEmail(email);

    if (emailExists) {
      throw new AppError("Endereço de e-mail já cadastrado", 409);
    }
    const hasedPassword = await hash(password, 10);

    const user = usersRepositories.create({
      name,
      email,
      password: hasedPassword,
    });

    await usersRepositories.save(user);

    return user
  }
}
