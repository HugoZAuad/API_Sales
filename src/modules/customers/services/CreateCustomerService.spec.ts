import AppError from "@shared/errors/AppError";
import CreateCustomerService from "@modules/customers/services/CreateCustomerService";

import { setupCustomerServiceTest } from "../domain/factory/CustomerServiceTestUtils";
import { Customer } from "@modules/customers/infra/database/entities/Customers";

describe('CreateCustomerService', () => {
  let createCustomer: CreateCustomerService;
  const { getFakeCustomerRepository, makeFakeCustomer } = setupCustomerServiceTest();

  beforeEach(() => {
    createCustomer = new CreateCustomerService(getFakeCustomerRepository());
  });

  it('Deve ser capaz de criar um novo cliente', async () => {
    const customerData = makeFakeCustomer({ email: 'unique.email@example.com' });

    const customer: Customer = await createCustomer.execute(customerData);

    expect(customer).toHaveProperty('id');
    expect(customer.email).toBe(customerData.email);
  });

  it('Não deve ser capaz de criar um cliente com email já em uso', async () => {
    const customerData = makeFakeCustomer({ email: 'duplicate.email@example.com' });

    await createCustomer.execute(customerData);

    await expect(
      createCustomer.execute(customerData)
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Deve lançar erro se dados obrigatórios estiverem ausentes', async () => {
    const customerData = makeFakeCustomer({ email: '' }); // email vazio

    await expect(createCustomer.execute(customerData)).rejects.toBeInstanceOf(AppError);
  });

  it('Deve lançar erro se email for inválido', async () => {
    const customerData = makeFakeCustomer({ email: 'email-invalido' });

    await expect(createCustomer.execute(customerData)).rejects.toBeInstanceOf(AppError);
  });

  it('Deve criar cliente com dados contendo caracteres especiais', async () => {
    const customerData = makeFakeCustomer({ email: 'user+test@example.com' });

    const customer: Customer = await createCustomer.execute(customerData);

    expect(customer).toHaveProperty('id');
    expect(customer.email).toBe(customerData.email);
  });
});
