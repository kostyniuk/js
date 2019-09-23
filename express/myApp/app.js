'use strict';

const express = require('express');
const app = express();

const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!!!');
});

app.listen(PORT, (err) => {
  if (err) return console.error(err);
  console.log(`Example app is listening at ${PORT} port`);
});
