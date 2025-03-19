const {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
} = require("./book.controller");

const routes = (app) => {
  app.post("/", createBook);
  app.get("/", getBooks);
  app.get("/:id", getBookById);
  app.put("/:id", updateBook);
  app.delete("/:id", deleteBook);
};

module.exports = routes;
