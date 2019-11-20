'use strict';

const mongoose = require('mongoose');

const Product = require('../models/product');

exports.getAll = (req, res, next) => {
  Product.find()
    .select('_id name price productImage')
    .exec()
    .then(docs => {
      const responce =
        docs.map(doc => ({
          _id: doc._id,
          name: doc.name,
          price: doc.price,
          productImage: doc.productImage,
          request: {
            type: 'GET',
            url: `http://localhost:3000/products/${doc._id}`
          } }));
      console.log(docs);
      res.json({ responce });
    })
    .catch(err => {
      console.log(err);
      res.json({ err });
    });
};

exports.createProduct = (req, res, next) => {
  const product = Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path
  });
  product.save()
    .then(result => {
      const response = {
        _id: result._id,
        name: result.name,
        price: result.price,
        productImage: result.productImage,
        request: {
          type: 'POST',
          url: `http://localhost:3000/products/${result._id}`
        } };

      console.log({ result });
      res.status(200).json({
        createdRecord: response
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ err });
    });
};

exports.getOne = (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id).exec()
    .then(doc => {
      if (doc) {
        const response = {
          _id: doc._id,
          name: doc.name,
          price: doc.price,
          productImage: doc.productImage,
          request: {
            type: 'GET',
            url: `http://localhost:3000/products/${doc._id}`
          } };

        console.log({ response });
        res.status(200).json({
          searchedRecord: response
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
};

exports.change = (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  console.log(req.body)
  for (const op of req.body) {
    updateOps[op.propName] = op.value;
  }

  Product.updateOne({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      const updatedRecord = {
        _id: id,
        request: {
          type: 'PUT',
          url: `http://localhost:3000/products/${id}`
        }
      };
      console.log({ result });
      res.status(200).json({ updatedRecord });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ err });
    });
};

exports.deleteProduct = (req, res, next) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then(docs => {
      const deletedRecord = {
        _id: id,
        request: {
          type: 'DELETE',
          remaining: 'http://localhost:3000/products/'
        }
      };
      res.status(200).json(deletedRecord);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
};
