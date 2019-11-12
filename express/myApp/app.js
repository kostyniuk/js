'use strict';

const express = require('express');
const app = express();
const path = require('path');

const PORT = 3000;

app.use('/static', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send('Hello world');
});

app.listen(PORT, (err) => {
  if (err) return console.error(err);
  console.log(`Example app is listening at http://localhost:${PORT} `);
});
