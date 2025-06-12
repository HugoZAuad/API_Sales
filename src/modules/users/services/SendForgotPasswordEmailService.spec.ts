import AppError from "@shared/errors/AppError";
import FakeUsersRepositories from "@modules/users/infra/database/repositories/Fakes/FakeUsersRepositories";
import SendForgotPasswordEmailService from "./SendForgotPasswordEmailService";
import { userTokensRepositories } from "../infra/database/repositories/UserTokensRepositories";
import { sendEmail } from "@config/Email";

jest.mock("../infra/database/repositories/UserTokensRepositories");
jest.mock("@config/Email");

describe('SendForgotPasswordEmailService', () => {
  let fakeUsersRepositories: FakeUsersRepositories;
  let sendForgotPasswordEmailService: SendForgotPasswordEmailService;

  beforeEach(() => {
    fakeUsersRepositories = new FakeUsersRepositories();
    sendForgotPasswordEmailService = new SendForgotPasswordEmailService(fakeUsersRepositories);
  });

  it('Deve enviar email de recuperação de senha com sucesso', async () => {
    const user = await fakeUsersRepositories.create({
      name: 'Usuário Teste',
      email: 'usuario.teste@example.com',
      password: '123456',
    });

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
});
