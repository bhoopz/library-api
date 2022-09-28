var express = require("express");
var router = express.Router();
const {
  allBooks,
  addBook,
  deleteBook,
  editBook,
  borrowBook,
  returnBook,
  availableBooks,
} = require("../controllers/bookController");
var { checkRole } = require("../middlewares/roleMiddleware");

/* GET home page. */
router
  .route("/")
  .get(checkRole("user", "admin"), allBooks)
  .post(checkRole("admin"), addBook);
router.route("/available").get(checkRole("user", "admin"), availableBooks);
router
  .route("/:id")
  .delete(checkRole("admin"), deleteBook)
  .put(checkRole("admin"), editBook);
router.route("/:id/borrow").get(checkRole("user"), borrowBook);
router.route("/:id/return").delete(checkRole("user"), returnBook);

module.exports = router;
