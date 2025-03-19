const Customer = require("./models/Customer");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const {
  GlobalResponse,
  GlobalResponseData,
} = require("../../global/globalResponse");
const bcrypt = require("bcrypt");
const { generateToken } = require("../../providers/jwt-provider");
const logger = require("../../config/logger");

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
    const customer = await Customer.create(userNew);
    //ghi lại log
    logger.info(`Creating new customer: ${JSON.stringify(userNew)}`);
    logger.info(`Customer created successfully with ID: ${customer._id}`);
    return res
      .status(StatusCodes.CREATED)
      .json(
        GlobalResponseData(StatusCodes.CREATED, ReasonPhrases.CREATED, customer)
      );
  } catch (error) {
    logger.error(`Error creating customer: ${error.message}`);
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
    logger.info(`Login customer successfully with ID: ${checkCustomer._id}`);
    return res.status(StatusCodes.OK).json(
      GlobalResponseData(StatusCodes.OK, ReasonPhrases.OK, {
        accessToken,
        refreshToken,
      })
    );
  } catch (error) {
    logger.error(`Error logging in customer: ${error.message}`);
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
