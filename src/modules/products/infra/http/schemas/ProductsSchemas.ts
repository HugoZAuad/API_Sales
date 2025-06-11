import { celebrate, Joi, Segments } from "celebrate";

export const CreateProductSchema = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required(),
    price: Joi.number().positive().precision(2).required(),
    quantity: Joi.number().positive().integer().required(),
  }),
});

export const UpadateProductSchema = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().required(),
  }),
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required(),
    price: Joi.number().positive().precision(2).required(),
    quantity: Joi.number().positive().integer().required(),
  }),
});

export const idParamsValidation = celebrate({
  [Segments.PARAMS]: {
    id: Joi.string().required(),
  },
});
