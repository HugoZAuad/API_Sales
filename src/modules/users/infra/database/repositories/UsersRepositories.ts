import { AppDataSource } from "@shared/infra/typeorm/data-source";
import { Repository } from "typeorm";
import { User } from "../entities/User";
import { IUsersRepositories } from "@modules/users/domain/repositories/IUsersRepositories";
import { ICreateUser } from "@modules/users/domain/models/ICreateUser";

export default class UsersRepositories implements IUsersRepositories {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository(User);
  }

  async findByName(name: string): Promise<User | null> {
    const user = await this.ormRepository.findOneBy({ name });
    return user;
  }

  async findById(id: number): Promise<User | null> {
    const user = await this.ormRepository.findOneBy({ id });
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.ormRepository.findOneBy({ email });
    return user;
  }

  async create(data: ICreateUser): Promise<User> {
    const user = this.ormRepository.create(data);
    await this.ormRepository.save(user);
    return user;
  }

  async save(user: User): Promise<User> {
    await this.ormRepository.save(user);
    return user;
  }

  async remove(user: User): Promise<void> {
    await this.ormRepository.remove(user);
  }
}
