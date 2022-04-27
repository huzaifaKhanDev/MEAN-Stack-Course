const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, 'typically_we_have_a_longer_string_here');
    next();
  } catch (error) {
    res.status(401).json({message: 'Auth failed!'});
  }

};
