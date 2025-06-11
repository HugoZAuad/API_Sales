import { Router } from "express";
import ForgotPasswordControllers from "../controllers/ForgotPasswordControllers";
import ResetPasswordControllers from "../controllers/ResetPasswordControllers";
import {
  ForgotPasswordSchema,
  ResetPasswordSchema,
} from "../schemas/PasswordSchemas";

const passwordRouter = Router();
const forgotPasswordControllers = new ForgotPasswordControllers();
const resetPasswordControllers = new ResetPasswordControllers();

passwordRouter.post(
  "/forgot",
  ForgotPasswordSchema,
  forgotPasswordControllers.create
);

passwordRouter.post(
  "/reset",
  ResetPasswordSchema,
  resetPasswordControllers.create
);

export default passwordRouter;
