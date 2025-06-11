import { Request, Response } from "express";
import UpdateUserAvatarService from "@modules/users/services/UpdateUserAvatarService";
import { container } from "tsyringe"

export default class UpdateAvatarControllers {
  async update(request: Request, response: Response): Promise<Response> {
    const updateUserAvatar = container.resolve(UpdateUserAvatarService);

    const user = await updateUserAvatar.execute({
      userId: Number(request.user.id),
      avatarFileName: request.file?.filename as string,
    });

    return response.json(user);
  }
}
