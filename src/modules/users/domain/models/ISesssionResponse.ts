import { User } from "@modules/users/infra/database/entities/User"

export interface ISesssionResponse {
  user: User
  token: string
}