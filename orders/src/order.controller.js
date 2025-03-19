const { DTOCreateOrder, DTOUpdateOrder } = require("./models/Order.dto");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const { GlobalResponse } = require("../../global/globalResponse");
const {
  createOrderService,
  getOrdersService,
  getOrderByIdService,
  updateOrderService,
  deleteOrderService,
} = require("./order.service");

const createOrder = async (req, res) => {
  try {
    const { error, value } = DTOCreateOrder(req.body);
    if (error) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(GlobalResponse(StatusCodes.BAD_REQUEST, error));
    }
    return createOrderService(value, res);
  } catch {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        GlobalResponse(
          StatusCodes.INTERNAL_SERVER_ERROR,
          ReasonPhrases.INTERNAL_SERVER_ERROR
        )
      );
  }
};

const getOrders = async (req, res) => {
  try {
    const { limit, page, customerId } = req.query;
    return getOrdersService(limit || 10, page || 0, customerId, res);
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

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(GlobalResponse(StatusCodes.BAD_REQUEST, "Id is required"));
    }
    return getOrderByIdService(id, res);
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

const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(GlobalResponse(StatusCodes.BAD_REQUEST, "Id is required"));
    }
    const { error, value } = DTOUpdateOrder(req.body);
    if (error) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(GlobalResponse(StatusCodes.BAD_REQUEST, error));
    }
    return updateOrderService(id, value, res);
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

const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(GlobalResponse(StatusCodes.BAD_REQUEST, "Id is required"));
    }
    return deleteOrderService(id, res);
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

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
};
