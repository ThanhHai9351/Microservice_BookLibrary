const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const {
  GlobalResponse,
  GlobalResponseData,
} = require("../../global/globalResponse");
const logger = require("../../config/logger");
const axios = require("axios");
const Order = require("./models/Order");

const createOrderService = async (data, res) => {
  try {
    const customer = await axios.get(
      `${process.env.CUSTOMER_SERVICE_URL}/${data.customerId}`
    );
    if (!customer) {
      logger.error(
        `Order Service: Customer not found: ${JSON.stringify(customer)}`
      );
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(GlobalResponse(StatusCodes.BAD_REQUEST, "Customer not found"));
    }
    const book = await axios.get(
      `${process.env.BOOK_SERVICE_URL}/${data.bookId}`
    );
    if (!book) {
      logger.error(`Order Service: Book not found: ${JSON.stringify(book)}`);
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(GlobalResponse(StatusCodes.BAD_REQUEST, "Book not found"));
    }
    const order = await Order.create(data);
    logger.info(`Order Service: Order created: ${JSON.stringify(order)}`);
    return res
      .status(StatusCodes.CREATED)
      .json(
        GlobalResponseData(StatusCodes.CREATED, ReasonPhrases.CREATED, order)
      );
  } catch (error) {
    logger.error(
      `Order Service: Error creating order: ${JSON.stringify(error)}`
    );
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

const getOrdersService = async (limit, page, customerId, res) => {
  try {
    let query = {};
    if (customerId) {
      query.customerId = customerId;
    }

    const orders = await Order.find(query)
      .limit(limit)
      .skip(page * limit)
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments(query);

    // Lấy thông tin customer và book cho mỗi order
    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => {
        const [customer, book] = await Promise.all([
          axios.get(`${process.env.CUSTOMER_SERVICE_URL}/${order.customerId}`),
          axios.get(`${process.env.BOOK_SERVICE_URL}/${order.bookId}`),
        ]);

        return {
          ...order.toJSON(),
          customer: customer.data.data,
          book: book.data.data,
        };
      })
    );

    const responseData = {
      data: ordersWithDetails,
      total: total,
      pageCurrent: parseInt(page) + 1,
      totalPage: Math.ceil(total / limit),
    };

    logger.info(
      `Order Service: Get orders successfully ${JSON.stringify(responseData)}`
    );
    return res
      .status(StatusCodes.OK)
      .json(GlobalResponseData(StatusCodes.OK, ReasonPhrases.OK, responseData));
  } catch (error) {
    logger.error(
      `Order Service: Error getting orders: ${JSON.stringify(error)}`
    );
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

const getOrderByIdService = async (id, res) => {
  try {
    const order = await Order.findById(id);
    if (!order) {
      logger.warn(`Order Service: Order not found with id: ${id}`);
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(GlobalResponse(StatusCodes.NOT_FOUND, "Order not found"));
    }

    const [customer, book] = await Promise.all([
      axios.get(`${process.env.CUSTOMER_SERVICE_URL}/${order.customerId}`),
      axios.get(`${process.env.BOOK_SERVICE_URL}/${order.bookId}`),
    ]);

    const orderWithDetails = {
      ...order.toJSON(),
      customer: customer.data.data,
      book: book.data.data,
    };

    logger.info(
      `Order Service: Get order by id successfully: ${JSON.stringify(
        orderWithDetails
      )}`
    );
    return res
      .status(StatusCodes.OK)
      .json(
        GlobalResponseData(StatusCodes.OK, ReasonPhrases.OK, orderWithDetails)
      );
  } catch (error) {
    logger.error(
      `Order Service: Error getting order by id: ${JSON.stringify(error)}`
    );
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

const updateOrderService = async (id, updateData, res) => {
  try {
    const order = await Order.findById(id);
    if (!order) {
      logger.warn(`Order Service: Order not found with id: ${id}`);
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(GlobalResponse(StatusCodes.NOT_FOUND, "Order not found"));
    }

    if (updateData.customerId) {
      const customer = await axios.get(
        `${process.env.CUSTOMER_SERVICE_URL}/${updateData.customerId}`
      );
      if (!customer) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json(GlobalResponse(StatusCodes.BAD_REQUEST, "Customer not found"));
      }
    }

    if (updateData.bookId) {
      const book = await axios.get(
        `${process.env.BOOK_SERVICE_URL}/${updateData.bookId}`
      );
      if (!book) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json(GlobalResponse(StatusCodes.BAD_REQUEST, "Book not found"));
      }
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    logger.info(
      `Order Service: Order updated successfully: ${JSON.stringify(
        updatedOrder
      )}`
    );
    return res
      .status(StatusCodes.OK)
      .json(GlobalResponseData(StatusCodes.OK, ReasonPhrases.OK, updatedOrder));
  } catch (error) {
    logger.error(`Order Service: Error updating order: ${error}`);
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

const deleteOrderService = async (id, res) => {
  try {
    const order = await Order.findById(id);
    if (!order) {
      logger.warn(`Order Service: Order not found with id: ${id}`);
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(GlobalResponse(StatusCodes.NOT_FOUND, "Order not found"));
    }

    await Order.findByIdAndDelete(id);

    logger.info(`Order Service: Order deleted successfully with id: ${id}`);
    return res
      .status(StatusCodes.OK)
      .json(GlobalResponse(StatusCodes.OK, "Order deleted successfully"));
  } catch (error) {
    logger.error(`Order Service: Error deleting order: ${error}`);
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
  createOrderService,
  getOrdersService,
  getOrderByIdService,
  updateOrderService,
  deleteOrderService,
};
