import uploadConfig from "@config/Upload";
import productsRouter from "@modules/products/routes/ProductRoutes";
import avatarRouter from "@modules/users/routes/AvatarRoutes";
import passwordRouter from "@modules/users/routes/PasswordRoutes"
import sessionsRouter from "@modules/users/routes/SessionRoutes";
import usersRouter from "@modules/users/routes/UserRoutes";
import express, { Router } from "express";

const routes = Router();

routes.get("/health", (request, response) => {
  return response.json({ message: "Hello Dev! I am alive!" });
});
routes.use("/products", productsRouter);
routes.use("/users", usersRouter);
routes.use("/sessions", sessionsRouter);
routes.use("/avatar", avatarRouter);
routes.use("/files", express.static(uploadConfig.directory));
routes.use("/password", passwordRouter)

export default routes;
