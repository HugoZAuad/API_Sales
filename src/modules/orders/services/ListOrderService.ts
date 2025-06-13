import { inject, injectable } from 'tsyringe';
import { IOrderRepositories } from '../domain/repositories/ICreateOrderRepositories';
import { IOrder } from '../domain/models/IOrder';

interface SearchParams {
  page: number;
  limit: number;
}

@injectable()
class ListOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrderRepositories,
  ) {}

  public async execute({ page, limit }: SearchParams): Promise<IOrder[]> {
    const take = limit;
    const skip = (Number(page) - 1) * take;
    const orders = await this.ordersRepository.findAll({
      skip,
      take,
    });

    return orders;
  }
}

export default ListOrderService;
