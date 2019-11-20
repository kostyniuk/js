'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

const checkAuth = require('../middleware/checkAuth');

router.get('/', checkAuth, (req, res, next) => {
  Order.find()
    .select('_id product quantity')
    .populate('product', '_id name')
    .exec()
    .then(docs => {
      const data =
        docs.map(doc => ({
          _id: doc._id,
          product: doc.product,
          quantity: doc.quantity,
          request: {
            type: 'GET',
            url: `http://localhost:3000/orders/${doc._id}`
          } }));
      console.log(docs);
      res.json({ data });
    })
    .catch(err => {
      console.log(err);
      res.json({ err });
    });
});

router.post('/', checkAuth, (req, res, next) => {
  Product.findById(req.body.productId).exec()
    .then(product => {
      console.log({ product });
      if (!product) {
        return res.status(500).json({
          message: 'Product not found'
        });
      }
      const order = Order({
        _id: new mongoose.Types.ObjectId(),
        product: req.body.productId,
        quantity: req.body.quantity
      });
      return order.save();
    })
    .then(result => {
      console.log({ result });
      res.status(201).json({
        _id: result._id,
        product: result.product,
        quantity: result.quantity
      });
    })
    .catch(err => {
      res.status(500).json({ err });
    });
});

router.get('/:orderId', checkAuth, (req, res, next) => {
  const id = req.params.orderId;
  Order.findById(id)
    .populate('product', '_id name')
    .exec()
    .then(doc => {
      if (!doc) return res.status(500).json({
        err: 'Order with that id not found',
        request: {
          type: 'GET',
          url: `http://localhost:3000/orders/${id}`,
          viewAll: 'http://localhost:3000/orders'
        }
      });
      const response = {
        _id: doc._id,
        product: doc.product,
        quantity: doc.quantity,
        request: {
          type: 'GET',
          url: `http://localhost:3000/products/${doc._id}`
        }
      };
      console.log({ response });
      res.status(200).json({
        searchedRecord: response
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.delete('/:orderId', checkAuth, (req, res, next) => {
  const id = req.params.orderId;
  Order.remove({ _id: id })
    .exec()
    .then(docs => {
      if (!docs.deletedCount) return res.status(500).json({ err: 'Order not found' });
      const deletedRecord = {
        _id: id,
        request: {
          type: 'DELETE',
          remaining: 'http://localhost:3000/orders/'
        }
      };
      res.status(200).json(deletedRecord);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
