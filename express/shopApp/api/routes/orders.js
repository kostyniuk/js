'use strict';

const express = require('express');
const router = express.Router();
const path = require('path');

console.log(path.basename(__dirname));

router.get('/', (req, res, next) => {
  res.send(`GET request to ${__filename}`);
});

router.post('/', (req, res, next) => {
  res.send(`POST request to ${__filename}`);
});

router.get('/:orderId', (req, res, next) => {
  const { orderId } = req.params;
  res.send(`GET request to ${__filename}, id: ${orderId}`);
});

router.delete('/:orderId', (req, res, next) => {
  const { orderId } = req.params;
  res.send(`DELETE request to ${__filename}, id: ${orderId}`);
});

module.exports = router;
