'use strict';

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const Product = require('../models/product');

router.get('/', (req, res, next) => {
  Product.find()
    .exec()
    .then(docs => {
      console.log(docs);
      res.json({ docs });
    })
    .catch(err => {
      console.log(err);
      res.json({ err });
    });
});

router.post('/', (req, res, next) => {
  const product = Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price
  });
  product.save()
    .then(result => console.log(result))
    .catch(err => console.log(err));
  res.json({
    message: product
  });
});

router.get('/:productId', (req, res, next) => {
  const id = req.params.productId;
  console.log(id);
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    console.log('Yes, its a valid ObjectId');
  } else {
    console.log('Invalid ObjectId');
  }
  //id = mongoose.Types.ObjectId(id);
  Product.findById(id).exec()
    .then(doc => {
      console.log('From database: ' + doc);
      res.status(200).json({ doc });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.put('/:productId', (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};

  for (const op of req.body) {
    updateOps[op.propName] = op.value;
  }

  Product.updateOne({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      console.log({ result });
      res.status(200).json({ result });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ err });
    });
});

router.delete('/:productId', (req, res, next) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then(docs => {
      console.log(docs);
      res.status(200).json(docs);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
