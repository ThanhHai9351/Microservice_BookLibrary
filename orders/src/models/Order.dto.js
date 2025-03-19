const Joi = require("joi");

const DTOCreateOrder = (data) => {
  const schema = Joi.object({
    customerId: Joi.string()
      .required()
      .messages({ "any.required": "CustomerId không được để trống" }),
    bookId: Joi.string()
      .required()
      .messages({ "any.required": "BookId không được để trống" }),
    gotDate: Joi.date()
      .required()
      .messages({ "any.required": "GotDate không được để trống" }),
    deliveryDate: Joi.date()
      .required()
      .messages({ "any.required": "DeliveryDate không được để trống" }),
  });

  const { error, value } = schema.validate(data);
  return { error, value };
};

const DTOUpdateOrder = (data) => {
  const schema = Joi.object({
    customerId: Joi.string().optional(),
    bookId: Joi.string().optional(),
    gotDate: Joi.date().optional(),
    deliveryDate: Joi.date().optional(),
  });

  const { error, value } = schema.validate(data);
  return { error, value };
};

module.exports = { DTOCreateOrder, DTOUpdateOrder };
