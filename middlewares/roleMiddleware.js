const checkRole = (...roles) => {
  return (req, res, next) => {
    if (roles.includes(req.user.user[0].role)) {
      return next();
    } else {
      return res.status(401).send({ message: "Access denied" });
    }
  };
};

module.exports = { checkRole };
