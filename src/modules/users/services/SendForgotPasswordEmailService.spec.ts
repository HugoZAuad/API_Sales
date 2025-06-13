import AppError from "@shared/errors/AppError";
import { makeFakeUser, makeFakeUserRepository } from "@modules/users/domain/factory/UserFactory";
import SendForgotPasswordEmailService from "./SendForgotPasswordEmailService";
import { userTokensRepositories } from "../infra/database/repositories/UserTokensRepositories";
import { sendEmail } from "@config/Email";

jest.mock("../infra/database/repositories/UserTokensRepositories");
jest.mock("@config/Email");

describe('SendForgotPasswordEmailService', () => {
  let fakeUsersRepositories: ReturnType<typeof makeFakeUserRepository>;
  let sendForgotPasswordEmailService: SendForgotPasswordEmailService;

  beforeEach(() => {
    fakeUsersRepositories = makeFakeUserRepository();
    sendForgotPasswordEmailService = new SendForgotPasswordEmailService(fakeUsersRepositories);
  });

  it('Deve enviar email de recuperação de senha com sucesso', async () => {
    const userData = makeFakeUser({ name: 'Usuário Teste', email: 'usuario.teste@example.com', password: '123456' });
    const user = await fakeUsersRepositories.create(userData);

    (userTokensRepositories.generate as jest.Mock).mockResolvedValue({ token: 'valid-token' });
    (sendEmail as jest.Mock).mockImplementation(() => Promise.resolve());

    await expect(sendForgotPasswordEmailService.execute({ email: user.email })).resolves.toBeUndefined();

    expect(userTokensRepositories.generate).toHaveBeenCalledWith(user.id);
    expect(sendEmail).toHaveBeenCalled();
  });

  it('Deve lançar erro se usuário não for encontrado', async () => {
    await expect(
      sendForgotPasswordEmailService.execute({ email: 'naoexiste@example.com' })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Deve lançar erro se falhar a geração do token', async () => {
    const userData = makeFakeUser({ name: 'Usuário Teste', email: 'usuario.teste@example.com', password: '123456' });
    const user = await fakeUsersRepositories.create(userData);

    (userTokensRepositories.generate as jest.Mock).mockRejectedValue(new Error('Token generation error'));

    await expect(sendForgotPasswordEmailService.execute({ email: user.email })).rejects.toThrow('Token generation error');
  });

  it('Deve lançar erro se falhar o envio do email', async () => {
    const userData = makeFakeUser({ name: 'Usuário Teste', email: 'usuario.teste@example.com', password: '123456' });
    const user = await fakeUsersRepositories.create(userData);

    (userTokensRepositories.generate as jest.Mock).mockResolvedValue({ token: 'valid-token' });
    (sendEmail as jest.Mock).mockImplementation(() => Promise.reject(new Error('Email sending error')));

    await expect(sendForgotPasswordEmailService.execute({ email: user.email })).rejects.toBeInstanceOf(Error);
  });
});
