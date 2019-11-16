'use strict';

const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.send(`GET request to ${__filename}`);
});

router.post('/', (req, res, next) => {
  const order  = {
    name: req.body.name,
    price: req.body.price
  };
  res.json({
    'message': 'All went good',
    order
  });
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
