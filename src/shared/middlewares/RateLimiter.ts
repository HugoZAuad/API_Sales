import AppError from "@shared/errors/AppError"
import { Request, Response, NextFunction } from "express"
import { RateLimiterRedis } from "rate-limiter-flexible"
import { createClient } from "redis"

const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  password: process.env.REDIS_PASS || undefined,
})

redisClient.connect().catch(console.error)

const limiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'ratelimit',
  points: 50,
  duration: 50,
})

export default async function rateLimiter(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await limiter.consume(request.ip as string)
    return next()
  } catch (err) {
    throw new AppError('Muitas requisiçõs', 429)
  }
}