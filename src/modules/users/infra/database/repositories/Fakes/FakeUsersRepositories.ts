import { User } from "@modules/users/infra/database/entities/User";
import { IUsersRepositories, Pagination } from "@modules/users/domain/repositories/IUsersRepositories";
import { ICreateUser } from "@modules/users/domain/models/ICreateUser";

export default class FakeUsersRepositories implements IUsersRepositories {
  private users: User[] = [];

  public async create(data: ICreateUser): Promise<User> {
    const user = new User();

    user.id = this.users.length + 1;
    user.name = data.name;
    user.email = data.email;
    user.password = data.password;
    user.avatar = '';
    user.created_at = new Date();
    user.updated_at = new Date();

    this.users.push(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    const findIndex = this.users.findIndex(u => u.id === user.id);

    if (findIndex !== -1) {
      this.users[findIndex] = user;
    }

    return user;
  }

  public async remove(user: User): Promise<void> {
    const index = this.users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      this.users.splice(index, 1);
    }
  }

  public async findById(id: number): Promise<User | null> {
    const user = this.users.find(u => u.id === id);
    return user || null;
  }

  public async findByName(name: string): Promise<User | null> {
    const user = this.users.find(u => u.name === name);
    return user || null;
  }

  public async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find(u => u.email === email);
    return user || null;
  }

  public async find(): Promise<User[]> {
    return this.users;
  }

  public async findAndCount(pagination: Pagination): Promise<[User[], number]> {
    const { skip, take } = pagination;
    const items = this.users.slice(skip, skip + take);
    return [items, this.users.length];
  }
}
