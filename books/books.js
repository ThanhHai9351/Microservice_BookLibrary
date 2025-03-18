const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Book = require("./book");

const app = express();
const port = 5001;

app.use(bodyParser.json());

const mongodbConnect = async () => {
  try {
    await mongoose.connect(`mongodb://127.0.0.1:27017/Books`);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
    console.log("Error connecting to MongoDB");
  }
};

app.post("/", async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/", async (req, res) => {
  try {
    const books = await Book.find({});
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/:id", async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete("/:id", async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(port, () => {
  mongodbConnect();
  console.log(`Server is running : ${port} -- This is our Books service`);
});
