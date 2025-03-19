const { DTOCreateBook, DTOUpdateBook } = require("./models/Book.dto");
const { GlobalResponse } = require("../../global/globalResponse");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const {
  createBookService,
  getBooksService,
  getBookByIdService,
  updateBookService,
  deleteBookService,
} = require("./book.service");

const createBook = async (req, res) => {
  try {
    const { error, value } = DTOCreateBook(req.body);
    if (error) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(GlobalResponse.error(ReasonPhrases.BAD_REQUEST, error));
    }
    return createBookService(value, res);
  } catch {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(GlobalResponse.error(ReasonPhrases.INTERNAL_SERVER_ERROR, error));
  }
};

const getBooks = async (req, res) => {
  try {
    const { limit, page, search } = req.query;
    return getBooksService(limit || 10, page || 0, search || "", res);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(GlobalResponse.error(ReasonPhrases.INTERNAL_SERVER_ERROR, error));
  }
};

const getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(
          GlobalResponse.error(ReasonPhrases.BAD_REQUEST, "Id is required")
        );
    }
    return getBookByIdService(id, res);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(GlobalResponse.error(ReasonPhrases.INTERNAL_SERVER_ERROR, error));
  }
};

const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(
          GlobalResponse.error(ReasonPhrases.BAD_REQUEST, "Id is required")
        );
    }
    const { error, value } = DTOUpdateBook(req.body);
    if (error) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(GlobalResponse.error(ReasonPhrases.BAD_REQUEST, error));
    }
    return updateBookService(id, value, res);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(GlobalResponse.error(ReasonPhrases.INTERNAL_SERVER_ERROR, error));
  }
};

const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(
          GlobalResponse.error(ReasonPhrases.BAD_REQUEST, "Id is required")
        );
    }
    return deleteBookService(id, res);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(GlobalResponse.error(ReasonPhrases.INTERNAL_SERVER_ERROR, error));
  }
};

module.exports = {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
};
