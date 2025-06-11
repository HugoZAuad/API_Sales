import uploadConfig from "@config/Upload";
// Update the path below if the actual file name or folder structure is different
import customerRoutes from "@modules/customers/infra/http/routes/CustomerRoutes";
import ordersRouter from "@modules/orders/infra/http/routes/OrderRoutes"
import productsRouter from "@modules/products/infra/http/routes/ProductRoutes";
import avatarRouter from "@modules/users/infra/http/routes/AvatarRoutes";
import passwordRouter from "@modules/users/infra/http/routes/PasswordRoutes"
import profileRouter from "@modules/users/infra/http/routes/ProfileRoutes"
import sessionsRouter from "@modules/users/infra/http/routes/SessionRoutes";
import usersRouter from "@modules/users/infra/http/routes/UserRoutes";
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
routes.use("/passwords", passwordRouter)
routes.use("/profiles", profileRouter)
routes.use('/customers', customerRoutes)
routes.use('/orders', ordersRouter)

export default routes;
