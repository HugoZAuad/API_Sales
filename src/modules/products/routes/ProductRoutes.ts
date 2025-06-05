import { Router } from "express";
import ProductsControllers from "../controllers/ProductsControllers";
import {
  CreateProductSchema,
  idParamsValidation,
  UpadateProductSchema,
} from "../schemas/ProductsSchemas";

const productsRouter = Router();
const productsController = new ProductsControllers();

productsRouter.get("/", productsController.index);
productsRouter.get("/:id", idParamsValidation, productsController.show);
productsRouter.post("/", CreateProductSchema, productsController.create);
productsRouter.put("/:id", UpadateProductSchema, productsController.update);
productsRouter.delete("/:id", idParamsValidation, productsController.delete);

export default productsRouter;
