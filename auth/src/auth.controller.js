const {
  DTOCreateCustomer,
  DTOLoginCustomer,
} = require("./models/Customer.dto");
const { GlobalResponse } = require("../../global/globalResponse");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const { createCustomer, loginCustomerService } = require("./auth.service");

const registerCustomer = async (req, res) => {
  try {
    const { error, value } = DTOCreateCustomer(req.body);
    if (error) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(
          GlobalResponse(StatusCodes.BAD_REQUEST, error.details[0].message)
        );
    }
    return createCustomer(value, res);
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        GlobalResponse(
          StatusCodes.INTERNAL_SERVER_ERROR,
          ReasonPhrases.INTERNAL_SERVER_ERROR
        )
      );
  }
};

const loginCustomer = async (req, res) => {
  try {
    const { error, value } = DTOLoginCustomer(req.body);
    if (error) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(
          GlobalResponse(StatusCodes.BAD_REQUEST, error.details[0].message)
        );
    }
    return loginCustomerService(value, res);
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        GlobalResponse(
          StatusCodes.INTERNAL_SERVER_ERROR,
          ReasonPhrases.INTERNAL_SERVER_ERROR
        )
      );
  }
};
module.exports = { registerCustomer, loginCustomer };
