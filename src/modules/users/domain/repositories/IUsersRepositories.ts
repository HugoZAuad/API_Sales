import { IUser } from "@modules/users/domain/models/IUser";
import { ICreateUser } from "../models/ICreateUser";

export interface Pagination {
  take: number;
  skip: number;
}

export interface IUsersRepositories {
  findByName(name: string): Promise<IUser | null>;
  findById(id: number): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  create(data: ICreateUser): Promise<IUser>;
  save(user: IUser): Promise<IUser>;
  remove(user: IUser): Promise<void>;
}
