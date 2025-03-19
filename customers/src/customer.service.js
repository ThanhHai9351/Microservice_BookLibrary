const Customer = require("./models/Customer");
const {
  GlobalResponse,
  GlobalResponseData,
} = require("../../global/globalResponse");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const logger = require("../../config/logger");
const { verifyToken } = require("../../providers/jwt-provider");
const getCustomersService = async (limit, page, search, res) => {
  try {
    let query = {};
    if (search && search !== "") {
      query.firstName = { $regex: search, $options: "i" };
      query.lastName = { $regex: search, $options: "i" };
    }
    const customers = await Customer.find(query)
      .limit(limit)
      .skip(page * limit);
    const total = await Customer.countDocuments(query);

    const responseData = {
      data: customers,
      total: total,
      pageCurrent: page + 1,
      totalPage: Math.ceil(total / limit),
    };
    logger.info(`Customer Service: Get customers successfully`);
    return res
      .status(StatusCodes.OK)
      .json(GlobalResponseData(StatusCodes.OK, ReasonPhrases.OK, responseData));
  } catch (error) {
    logger.error(`Customer Service: Get customers failed: ${error}`);
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

const getMeService = async (token, res) => {
  try {
    const data = await verifyToken(token, process.env.ACCESS_TOKEN);
    const customer = await Customer.findById(data._id);
    logger.info(
      `Customer Service: Get me Customer successfully: ${JSON.stringify(
        customer
      )}`
    );
    return res
      .status(StatusCodes.OK)
      .json(GlobalResponseData(StatusCodes.OK, ReasonPhrases.OK, customer));
  } catch (error) {
    logger.error(`Customer Service: Get me failed: ${error}`);
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

const getCustomerByIdService = async (id, res) => {
  try {
    const customer = await Customer.findById(id);
    if (!customer) {
      logger.warn(`Customer Service: Customer not found with id: ${id}`);
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(GlobalResponse(StatusCodes.NOT_FOUND, "Customer not found"));
    }

    logger.info(
      `Customer Service: Get customer by id successfully: ${JSON.stringify(
        customer
      )}`
    );
    return res
      .status(StatusCodes.OK)
      .json(GlobalResponseData(StatusCodes.OK, ReasonPhrases.OK, customer));
  } catch (error) {
    logger.error(`Customer Service: Get customer by id failed: ${error}`);
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

const updateCustomerService = async (id, updateData, res) => {
  try {
    const customer = await Customer.findById(id);
    if (!customer) {
      logger.warn(`Customer Service: Customer not found with id: ${id}`);
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(GlobalResponse(StatusCodes.NOT_FOUND, "Customer not found"));
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    logger.info(
      `Customer Service: Update customer successfully: ${JSON.stringify(
        updatedCustomer
      )}`
    );
    return res
      .status(StatusCodes.OK)
      .json(
        GlobalResponseData(StatusCodes.OK, ReasonPhrases.OK, updatedCustomer)
      );
  } catch (error) {
    logger.error(`Customer Service: Update customer failed: ${error}`);
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

const deleteCustomerService = async (id, res) => {
  try {
    const customer = await Customer.findById(id);
    if (!customer) {
      logger.warn(`Customer Service: Customer not found with id: ${id}`);
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(GlobalResponse(StatusCodes.NOT_FOUND, "Customer not found"));
    }

    await Customer.findByIdAndDelete(id);

    logger.info(
      `Customer Service: Delete customer successfully with id: ${id}`
    );
    return res
      .status(StatusCodes.OK)
      .json(GlobalResponse(StatusCodes.OK, "Customer deleted successfully"));
  } catch (error) {
    logger.error(`Customer Service: Delete customer failed: ${error}`);
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
  getCustomersService,
  getMeService,
  getCustomerByIdService,
  updateCustomerService,
  deleteCustomerService,
};
