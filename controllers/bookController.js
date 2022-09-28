const { conn } = require("../database");

const allBooks = (req, res) => {
  conn.query("SELECT * FROM books", (err, results) => {
    if (err) res.status(500).send(err);
    else res.status(200).send(results);
  });
};

const availableBooks = (req, res) => {
  const sql =
    "SELECT * FROM books WHERE id NOT IN (SELECT book_id FROM borrowings)";
  conn.query(sql, (err, results) => {
    if (err) res.status(500).send(err);
    else res.status(200).send(results);
  });
};

const addBook = async (req, res) => {
  const newBook = req.body;
  const sql = `INSERT INTO books (name, isbn, author) VALUES ("${newBook.name}", "${newBook.isbn}", "${newBook.author}")`;
  conn.query(sql, (err) => {
    if (err) res.status(500).send(err);
    else res.status(201).send(newBook);
  });
};

const deleteBook = async (req, res) => {
  const sql = `DELETE FROM books WHERE id = "${req.params.id}"`;
  conn.query(sql, (err, results) => {
    if (err) res.status(500).send({ message: "Book is probably borrowed" });
    else
      res
        .status(200)
        .send({ message: `Successfully deleted ${results.affectedRows} row` });
  });
};

const editBook = async (req, res) => {
  const editedBook = req.body;
  const sql = `UPDATE books SET ? WHERE id = ?`;
  conn.query(sql, [editedBook, req.params.id], (err, results) => {
    if (err) res.status(500).send(err);
    console.log(results);
    if (results.affectedRows > 0) {
      res.status(200).send(editedBook);
    } else {
      res.status(404).send({ message: "No book found with this id" });
    }
  });
};

const borrowBook = async (req, res) => {
  const user = req.user;
  conn.query(
    `SELECT * FROM borrowings WHERE book_id = "${req.params.id}"`,
    (err, results) => {
      if (err) res.status(500).send(err);
      if (results.length > 0)
        res.status(400).send({ message: "Book already borrowed" });
      else {
        const sql = `INSERT INTO borrowings (book_id, user_id) VALUES (?, ?)`;
        conn.query(sql, [req.params.id, user.user[0].id], (err) => {
          if (err)
            res
              .status(400)
              .send({ message: "Can not borrow book with this id" });
          else res.status(200).send({ message: "Book successfully borrowed" });
        });
      }
    }
  );
};

const returnBook = async (req, res) => {
  const user = req.user;
  const sql = `DELETE FROM borrowings WHERE book_id = ? AND user_id = ?`;
  conn.query(sql, [req.params.id, user.user[0].id], (err, results) => {
    if (err) res.status(500).send(err);
    if (results.affectedRows > 0) {
      res.status(200).send({ message: "Book successfully returned" });
    } else {
      res.status(404).send({ message: "Can not return not borrowed book" });
    }
  });
};

module.exports = {
  allBooks,
  addBook,
  deleteBook,
  editBook,
  borrowBook,
  returnBook,
  availableBooks,
};
