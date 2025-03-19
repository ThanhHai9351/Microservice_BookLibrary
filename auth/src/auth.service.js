const Customer = require("./models/Customer");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const {
  GlobalResponse,
  GlobalResponseData,
} = require("../../global/globalResponse");
const bcrypt = require("bcrypt");
const { generateToken } = require("../../providers/jwt-provider");

const createCustomer = async (data, res) => {
  try {
    const checkCustomer = await Customer.findOne({ email: data.email });
    if (checkCustomer) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(
          GlobalResponse(StatusCodes.BAD_REQUEST, "Customer already exists")
        );
    }
    const passwordNew = await bcrypt.hash(data.password, 10);
    const userNew = {
      ...data,
      password: passwordNew,
    };
    console.log(userNew);
    const customer = await Customer.create(userNew);
    return res
      .status(StatusCodes.CREATED)
      .json(
        GlobalResponseData(StatusCodes.CREATED, ReasonPhrases.CREATED, customer)
      );
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

const loginCustomerService = async (data, res) => {
  try {
    const checkCustomer = await Customer.findOne({ email: data.email });
    if (!checkCustomer) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(GlobalResponse(StatusCodes.BAD_REQUEST, "Customer not found"));
    }
    const isPasswordValid = await bcrypt.compare(
      data.password,
      checkCustomer.password
    );
    if (!isPasswordValid) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(GlobalResponse(StatusCodes.BAD_REQUEST, "Invalid password"));
    }
    const accessToken = await generateToken(
      { id: checkCustomer._id, email: checkCustomer.email },
      process.env.ACCESS_TOKEN,
      "1h"
    );
    const refreshToken = await generateToken(
      { id: checkCustomer._id, email: checkCustomer.email },
      process.env.REFRESH_TOKEN,
      "1d"
    );
    return res.status(StatusCodes.OK).json(
      GlobalResponseData(StatusCodes.OK, ReasonPhrases.OK, {
        accessToken,
        refreshToken,
      })
    );
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
module.exports = { createCustomer, loginCustomerService };
