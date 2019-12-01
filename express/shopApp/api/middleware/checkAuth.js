'use strict';

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    console.log(token)
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.userDta = decoded;
    next();
  } catch (err) {
    res.status(401).json({
      message: 'Authentification failed'
    });
  }
};
