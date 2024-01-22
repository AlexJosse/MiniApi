import Joi from 'joi';

// Schema for validating the request body when creating an order
export const createOrderSchema = Joi.object({
  mini: Joi.number().required().min(1).messages({
    'number.base': 'Mini must be a number',
    'number.min': 'Mini must be at least 1',
    'any.required': 'Mini is required',
  }),
  package: Joi.string().messages({
    'string.base': 'Package must be a string',
  }),
});