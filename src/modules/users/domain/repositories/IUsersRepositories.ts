import { ICreateUser } from "../models/ICreateUser";
import { User } from "@modules/users/infra/database/entities/User";

export interface Pagination {
  take: number;
  skip: number;
}

export interface IUsersRepositories {
  findByName(name: string): Promise<User | null>;
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: ICreateUser): Promise<User>;
  save(user: User): Promise<User>;
  remove(user: User): Promise<void>;
  find(): Promise<User[]>;
  findAndCount(pagination: Pagination): Promise<[User[], number]>;
}
