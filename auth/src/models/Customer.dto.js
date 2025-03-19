const Joi = require("joi");

const DTOCreateCustomer = (data) => {
  const schema = Joi.object({
    firstName: Joi.string()
      .required()
      .messages({ "any.required": "Tên đăng nhập không được để trống" }),
    lastName: Joi.string()
      .required()
      .messages({ "any.required": "Mật khẩu không được để trống" }),
    email: Joi.string()
      .required()
      .messages({ "any.required": "Tên không được để trống" }),
    password: Joi.string()
      .required()
      .messages({ "any.required": "Mật khẩu không được để trống" }),
    age: Joi.number()
      .required()
      .messages({ "any.required": "Tuổi không được để trống" }),
  });

  const { error, value } = schema.validate(data);
  return { error, value };
};

const DTOUpdateCustomer = (data) => {
  const schema = Joi.object({
    password: Joi.string().optional(),
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    email: Joi.string().optional(),
    age: Joi.number().optional(),
  });

  const { error, value } = schema.validate(data);
  return { error, value };
};

const DTOLoginCustomer = (data) => {
  const schema = Joi.object({
    email: Joi.string()
      .required()
      .messages({ "any.required": "Email không được để trống" }),
    password: Joi.string()
      .required()
      .messages({ "any.required": "Mật khẩu không được để trống" }),
  });

  const { error, value } = schema.validate(data);
  return { error, value };
};

module.exports = { DTOCreateCustomer, DTOUpdateCustomer, DTOLoginCustomer };
