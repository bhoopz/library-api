const jwt = require("jsonwebtoken");
const { conn } = require("../database");
const authenticateToken = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).send({ message: "Token is required" });
  }
  var token = req.headers.authorization.split(" ")[1];

  jwt.verify(token, "public secret whot", function (err, user) {
    if (err) res.status(403).send({ message: "Invalid token" });
    else {
      req.user = user;
      if (req.user) {
        conn.query(
          "SELECT id FROM users WHERE id = ?",
          [user.user[0].id],
          (err) => {
            if (err)
              res
                .status(403)
                .send({ message: "User no longer exists in database" });
            else next();
          }
        );
      } else res.status(500).send({ message: "Something went wrong" });
    }
  });
};

module.exports = { authenticateToken };
