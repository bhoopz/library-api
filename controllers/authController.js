const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { conn } = require("../database");

const register = async (req, res) => {
  conn.query(
    `SELECT * FROM users WHERE login = "${req.body.login}"`,
    (err, results) => {
      if (err) throw err;
      else if (results.length > 0) {
        return res.status(400).send({ message: "Login already exists" });
      } else if (
        req.body.login.toString().length &&
        req.body.password.toString().length > 3
      ) {
        bcrypt.hash(`${req.body.password}`, 10, function (err, hashedPass) {
          if (err) {
            res.json({ error: err });
          } else {
            const sql = `INSERT INTO users (name, login, password, role) VALUES ("${req.body.name}", "${req.body.login}", "${hashedPass}", "${req.body.role}")`;
            conn.query(sql, (err) => {
              if (err) throw err;
              res.status(201).send({ message: "Successfully registered" });
            });
          }
        });
      } else {
        res.status(401).send({
          message: "Login and password should have at least 4 characters",
        });
      }
    }
  );
};

const login = async (req, res) => {
  const login = req.body.login.toString();
  const password = req.body.password.toString();
  if (login && password) {
    conn.query(`SELECT * FROM users WHERE login = "${login}"`, (err, user) => {
      if (err) throw err;
      if (user.length == 0) {
        return res.status(401).send({ message: "Incorrect login or password" });
      } else {
        if (bcrypt.compare(password, user[0].password)) {
          console.log(user);
          const accessToken = jwt.sign({ user }, "public secret whot");

          return res.status(200).json({ accessToken: accessToken });
        } else {
          return res
            .status(401)
            .send({ message: "Incorrect login or password" });
        }
      }
    });
  } else {
    res.status(400).send({ message: "Please enter login and password" });
  }
};

module.exports = { register, login };
