'use strict';

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const multer = require('multer');

const Product = require('../models/product');

//const upload = multer({dest: 'uploads/' });
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false); // not save, not an error
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 10
  },
  fileFilter
});

router.get('/', (req, res, next) => {
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
});

router.post('/', upload.single('productImage'), (req, res, next) => {
  console.log(req.file);
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
});



router.get('/:productId', (req, res, next) => {
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
});

router.delete('/:productId', (req, res, next) => {
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
});

module.exports = router;
