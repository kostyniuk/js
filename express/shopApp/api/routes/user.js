'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/user');

router.get('/', (req, res, next) => {
  User.find()
    .exec()
    .then(docs => {
      const data =
        docs.map(doc => ({
          _id: doc._id,
          email: doc.email,
          password: doc.password,
          request: {
            type: 'GET',
            url: `http://localhost:3000/user/${doc._id}`
          } }));
      console.log(docs);
      res.json({ data });
    })
    .catch(err => {
      console.log(err);
      res.json({ err });
    });
});

router.post('/signup', (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length) {
        return res.status(409).json({
          err: 'User with that email already exists'
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            res.status(500).json({
              err
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
            });
            user.save()
              .then(result => {
                console.log({ result });
                res.status(201).json({
                  message: 'User created',
                  result
                });
              })
              .catch(err => {
                console.log({ err });
                res.status(500).json({
                  err
                });
              });
          }
        });
      }
    });
});

router.delete('/:userId', (req, res, next) => {
  const id = req.params.userId;
  User.remove({ _id: id })
    .exec()
    .then(docs => {
      if (!docs.deletedCount) return res.status(500).json({ err: 'User not found' });
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
