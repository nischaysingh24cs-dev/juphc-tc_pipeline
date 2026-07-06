const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Registration endpoint
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Task 10: Get the list of books available in the shop using Async/Await
public_users.get('/', async function (req, res) {
  try {
    // In a production/Axios task setup, this simulates fetching from an external catalog endpoint
    const getBooks = () => Promise.resolve(books);
    const bookList = await getBooks();
    res.status(200).send(JSON.stringify(bookList, null, 4));
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books", error: error.message });
  }
});

// Task 11: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  
  const findByIsbn = new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject({ status: 404, message: "Book not found" });
    }
  });

  findByIsbn
    .then((book) => res.status(200).send(JSON.stringify(book, null, 4)))
    .catch((err) => res.status(err.status).json({ message: err.message }));
});
  
// Task 12: Get book details based on author using Async/Await
public_users.get('/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    const getBooksByAuthor = () => {
      return new Promise((resolve) => {
        let results = [];
        for (let id in books) {
          if (books[id].author.toLowerCase() === author.toLowerCase()) {
            results.push({ "isbn": id, "title": books[id].title, "reviews": books[id].reviews });
          }
        }
        resolve(results);
      });
    };

    const matchedBooks = await getBooksByAuthor();
    if (matchedBooks.length > 0) {
      res.status(200).send(JSON.stringify(matchedBooks, null, 4));
    } else {
      res.status(404).json({ message: "No books found by this author" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error tracking author" });
  }
});

// Task 13: Get all books based on title using Promises
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;

  const getBooksByTitle = new Promise((resolve, reject) => {
    let results = [];
    for (let id in books) {
      if (books[id].title.toLowerCase() === title.toLowerCase()) {
        results.push({ "isbn": id, "author": books[id].author, "reviews": books[id].reviews });
      }
    }
    if (results.length > 0) {
      resolve(results);
    } else {
      reject({ status: 404, message: "No books found with this title" });
    }
  });

  getBooksByTitle
    .then((matchedBooks) => res.status(200).send(JSON.stringify(matchedBooks, null, 4)))
    .catch((err) => res.status(err.status).json({ message: err.message }));
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.status(200).json({ message: "Initial book reviews retrieved successfully", reviews: books[isbn].reviews });
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports = public_users;
