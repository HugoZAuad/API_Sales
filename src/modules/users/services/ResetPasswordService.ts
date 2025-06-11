import AppError from "@shared/errors/AppError";
import { userTokensRepositories } from "../infra/database/repositories/UserTokensRepositories";
import { isAfter, addHours } from "date-fns";
import { hash } from "bcrypt";
import { IResetPassword } from "../domain/models/IResetPassword"
import { IUsersRepositories } from "../domain/repositories/IUsersRepositories"
import { injectable, inject } from "tsyringe"

@injectable()
export default class ResetPasswordService {
  constructor(@inject('usersRepositories')
    private readonly usersRepositories: IUsersRepositories) {}
  async execute({ token, password }: IResetPassword): Promise<void> {
    const userToken = await userTokensRepositories.findByToken(token);

    if (!userToken) {
      throw new AppError("Token do usuario não existe.", 404);
    }

    const user = await this.usersRepositories.findById(userToken.user_id);

    if (!user) {
      throw new AppError("Usuario não existe.", 404);
    }

    const tokenCreatedAt = userToken.created_at;
    const compareDate = addHours(tokenCreatedAt, 2);

    if (isAfter(Date.now(), compareDate)) {
      throw new AppError("Token expirado.", 401);
    }

    user.password = await hash(password, 10);

    await this.usersRepositories.save(user);
  }
}
