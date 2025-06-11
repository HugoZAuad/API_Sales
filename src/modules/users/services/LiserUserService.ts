import { IPagination } from "@shared/interfaces/PaginationInterface"
import { User } from "../database/entities/User"
import { usersRepositories } from "../database/repositories/userRepositories"
import RedisCache from "@shared/cache/RedisCache"

export default class ListUserService {
  async execute(page: number = 1, limit: number = 10): Promise<IPagination<User>> {
    const redisCache = new RedisCache()

    let user = await redisCache.recover<User[]>(
      'api-mysales-USER_LIST',
    )

    if (!user) {
      user = await usersRepositories.find()
      await redisCache.save('api-mysales-USER_LIST', JSON.stringify(user))
    }

    const [data, total] = await usersRepositories.findAndCount({
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