'use strict';

const express = require('express');
const app = express();

const PORT = 3000;

app.get('/', (req, res, next) => {
  console.log('First middleware');
  next();
}, (req, res) => {
  res.send('Final middleware');
}
);

const cb1 = (req, res, next) => {
  console.log('Middleware 1');
  setTimeout(() => console.log('Timeout end'), 5000);
  next();
};

const cb2 = (req, res, next) => {
  console.log('Middleware 2');
  next();
};

const cb3 = (req, res) => {
  res.send('Final2 middleware');
};

app.get('/info', [cb1, cb2, cb3]);

app.listen(PORT, (err) => {
  if (err) return console.error(err);
  console.log(`Example app is listening at http://localhost:${PORT} `);
});
