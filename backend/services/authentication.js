const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization') && req.header('Authorization').split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: "Access token is missing or invalid" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    res.locals.email = user.email;
    next();
  });
};

module.exports = { authenticateToken };
