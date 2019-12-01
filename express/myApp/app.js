'use strict';

const express = require('express');
const app = express();
const path = require('path');

const info = require('./infoAboutMe');

const PORT = 3000;

app.use(info);

app.get('/', (req, res) => {
  res.send('Hello World!!!');
});

app.listen(PORT, (err) => {
  if (err) return console.error(err);
  console.log(`Example app is listening at http://localhost:${PORT} `);
});
