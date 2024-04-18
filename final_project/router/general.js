const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }
  if (users.some((user) => user.username === username)) {
    return res.status(409).json({ message: "Username already exists" });
  }
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get("/", async function (isbn) => {
  try {
    const book = books.find(book => book.isbn === isbn);
    if (!book) {
      throw new Error('Book not found');
    }
    return book;
  } catch (error) {
    console.error(error);
    return null;
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const book = Object.fromEntries(
      Object.entries(books).filter(([key]) => key.includes(isbn))
    );
    if (book) {
      return res.status(200).json(book);
    } else {
      throw new Error('Book not found');
    }
  } catch (error) {
    console.error(error);
    return res.status(404).json({ message: error.message });
  }
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  try {
    const author = req.params.author;
    const bookKeys = Object.keys(books);
    const matchingBooks = bookKeys.filter((key) => books[key].author === author);
    if (matchingBooks.length > 0) {
      return res.status(200).json(matchingBooks.map((key) => books[key]));
    } else {
      throw new Error('No books found by this author');
    }
  } catch (error) {
    console.error(error);
    return res.status(404).json({ message: error.message });
  }
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  try {
    const title = req.params.title;
    for (const [key, value] of Object.entries(books)) {
      if (value.title === title) {
        return res.status(200).json(books[key]);
      }
    }
    throw new Error('Book not found');
  } catch (error) {
    console.error(error);
    return res.status(404).json({ message: error.message });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    const reviews = book.reviews || [];
    return res.status(200).json(reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
