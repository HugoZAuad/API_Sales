import { IPagination } from "@shared/interfaces/PaginationInterface"
import { User } from "../infra/database/entities/User"
import RedisCache from "@shared/cache/RedisCache"
import { IUsersRepositories } from "../domain/repositories/IUsersRepositories"
import { injectable, inject } from "tsyringe"

@injectable()
export default class ListUserService {
  constructor(@inject('usersRepositories')
    private readonly usersRepositories: IUsersRepositories) {}
  async execute(page: number = 1, limit: number = 10): Promise<IPagination<User>> {
    const redisCache = new RedisCache()

    let user = await redisCache.recover<User[]>(
      'api-mysales-USER_LIST',
    )

    if (!user) {
      user = await this.usersRepositories.find()
      await redisCache.save('api-mysales-USER_LIST', JSON.stringify(user))
    }

    const [data, total] = await this.usersRepositories.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
    })

    const totalPages = Math.ceil(total / limit)

    return {
      data,
      total,
      per_page: limit,
      current_Page: page,
      total_pages: totalPages,
      next_page: page < totalPages ? page + 1 : null,
      prev_page: page > 1 ? page - 1 : null,
    } as IPagination<User>
  }
}