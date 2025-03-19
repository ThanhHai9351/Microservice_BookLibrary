const Joi = require("joi");

const DTOCreateBook = (data) => {
  const schema = Joi.object({
    title: Joi.string()
      .required()
      .messages({ "any.required": "Tên đăng nhập không được để trống" }),
    author: Joi.string()
      .required()
      .messages({ "any.required": "Mật khẩu không được để trống" }),
    numberPages: Joi.number()
      .required()
      .messages({ "any.required": "Tên không được để trống" }),
    publisher: Joi.string()
      .required()
      .messages({ "any.required": "Mật khẩu không được để trống" }),
  });

  const { error, value } = schema.validate(data);
  return { error, value };
};

const DTOUpdateBook = (data) => {
  const schema = Joi.object({
    title: Joi.string().optional(),
    author: Joi.string().optional(),
    numberPages: Joi.number().optional(),
    publisher: Joi.string().optional(),
  });

  const { error, value } = schema.validate(data);
  return { error, value };
};

module.exports = { DTOCreateBook, DTOUpdateBook };
