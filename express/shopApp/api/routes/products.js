'use strict';

const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const multer = require('multer');

const Product = require('../models/product');

const checkAuth = require('../middleware/checkAuth');

const ProductsController = require('../controllers/products');

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

router.get('/', ProductsController.getAll);

router.post('/', checkAuth, upload.single('productImage'), 
  ProductsController.createProduct);

router.get('/:productId', ProductsController.getOne);

router.put('/:productId', checkAuth, ProductsController.change);

router.delete('/:productId', checkAuth, ProductsController.deleteProduct);

module.exports = router;
