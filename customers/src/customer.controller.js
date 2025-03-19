const { GlobalResponse } = require("../../global/globalResponse");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const {
  getCustomersService,
  getMeService,
  getCustomerByIdService,
  updateCustomerService,
  deleteCustomerService,
} = require("./customer.service");
const { DTOUpdateCustomer } = require("../../auth/src/models/Customer.dto");

const getCustomers = async (req, res) => {
  try {
    const { limit, page, search } = req.query;
    return getCustomersService(limit || 10, page || 0, search || "", res);
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

const getMe = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(
          GlobalResponse(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED)
        );
    }
    const token = authHeader && authHeader.split(" ")[1];
    return getMeService(token, res);
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

const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(GlobalResponse(StatusCodes.BAD_REQUEST, "Id is required"));
    }
    return getCustomerByIdService(id, res);
  } catch (error) {
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

const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(GlobalResponse(StatusCodes.BAD_REQUEST, "Id is required"));
    }
    const { error, value } = DTOUpdateCustomer(req.body);
    if (error) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(GlobalResponse(StatusCodes.BAD_REQUEST, error.message));
    }
    return updateCustomerService(id, value, res);
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

const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(GlobalResponse(StatusCodes.BAD_REQUEST, "Id is required"));
    }
    return deleteCustomerService(id, res);
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

module.exports = {
  getCustomers,
  getMe,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
};
