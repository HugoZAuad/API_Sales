import uploadConfig from "@config/Upload";
import customerRoutes from "@modules/customers/routes/CustomerRoutes"
import ordersRouter from "@modules/orders/routes/OrderRoutes"
import productsRouter from "@modules/products/routes/ProductRoutes";
import avatarRouter from "@modules/users/routes/AvatarRoutes";
import passwordRouter from "@modules/users/routes/PasswordRoutes"
import profileRouter from "@modules/users/routes/ProfileRoutes"
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
routes.use("/passwords", passwordRouter)
routes.use("/profiles", profileRouter)
routes.use('/customers', customerRoutes)
routes.use('/orders', ordersRouter)

export default routes;
