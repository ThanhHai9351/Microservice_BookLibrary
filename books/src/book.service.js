const {
  GlobalResponse,
  GlobalResponseData,
} = require("../../global/globalResponse");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const Book = require("./models/Book");
const logger = require("../../config/logger");

const createBookService = async (data, res) => {
  try {
    const bookCreate = await Book.create(data);
    logger.info(
      `Book Service: Book created successfully: ${JSON.stringify(bookCreate)}`
    );
    return res
      .status(StatusCodes.CREATED)
      .json(
        GlobalResponseData(
          StatusCodes.CREATED,
          ReasonPhrases.CREATED,
          bookCreate
        )
      );
  } catch (error) {
    logger.error(`Book Service: Error creating book: ${JSON.stringify(error)}`);
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

const getBooksService = async (limit, page, search, res) => {
  try {
    let query = {};
    if (search && search !== "") {
      query = {
        $or: [
          { title: { $regex: search, $options: "i" } },
        ],
      };
    }

    const books = await Book.find(query)
      .limit(limit)
      .skip(page * limit);
    const total = await Book.countDocuments(query);

    const responseData = {
      data: books,
      total: total,
      pageCurrent: parseInt(page) + 1,
      totalPage: Math.ceil(total / limit),
    };

    logger.info(
      `Book Service: Get books successfully: ${JSON.stringify(responseData)}`
    );
    return res
      .status(StatusCodes.OK)
      .json(GlobalResponseData(StatusCodes.OK, ReasonPhrases.OK, responseData));
  } catch (error) {
    logger.error(`Book Service: Error getting books: ${JSON.stringify(error)}`);
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

const getBookByIdService = async (id, res) => {
  try {
    const book = await Book.findById(id);
    if (!book) {
      logger.warn(`Book Service: Book not found with id: ${id}`);
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(GlobalResponse(StatusCodes.NOT_FOUND, "Book not found"));
    }

    logger.info(
      `Book Service: Get book by id successfully: ${JSON.stringify(book)}`
    );
    return res
      .status(StatusCodes.OK)
      .json(GlobalResponseData(StatusCodes.OK, ReasonPhrases.OK, book));
  } catch (error) {
    logger.error(`Book Service: Error getting book by id: ${error}`);
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

const updateBookService = async (id, updateData, res) => {
  try {
    const book = await Book.findById(id);
    if (!book) {
      logger.warn(`Book Service: Book not found with id: ${id}`);
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(GlobalResponse(StatusCodes.NOT_FOUND, "Book not found"));
    }

    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    logger.info(
      `Book Service: Book updated successfully: ${JSON.stringify(updatedBook)}`
    );
    return res
      .status(StatusCodes.OK)
      .json(GlobalResponseData(StatusCodes.OK, ReasonPhrases.OK, updatedBook));
  } catch (error) {
    logger.error(`Book Service: Error updating book: ${error}`);
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

const deleteBookService = async (id, res) => {
  try {
    const book = await Book.findById(id);
    if (!book) {
      logger.warn(`Book Service: Book not found with id: ${id}`);
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(GlobalResponse(StatusCodes.NOT_FOUND, "Book not found"));
    }

    await Book.findByIdAndDelete(id);

    logger.info(`Book Service: Book deleted successfully with id: ${id}`);
    return res
      .status(StatusCodes.OK)
      .json(GlobalResponse(StatusCodes.OK, "Book deleted successfully"));
  } catch (error) {
    logger.error(`Book Service: Error deleting book: ${error}`);
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
  createBookService,
  getBooksService,
  getBookByIdService,
  updateBookService,
  deleteBookService,
};
