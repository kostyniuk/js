'use strict';

const express = require('express');
const productsRoute = require('./api/routes/products');
const ordersRoute = require('./api/routes/orders');
const app = express();


const PORT = process.env.PORT || 3000;

app.use('/products', productsRoute);
app.use('/orders', ordersRoute);

app.get('/', (req, res) => {
  res.send('Shop app main page');
});

app.listen(PORT, (err) => {
  if (err) return console.error(err);
  console.log(`Example app is listening at http://localhost:${PORT} `);
});
