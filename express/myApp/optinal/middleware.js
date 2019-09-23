'use strict';

const express = require('express');
const app = express();

const PORT = 3000;

app.use((req, res, next) => {
  console.log(req.headers);
  req.hash = {
    name: 'Alex',
    age: 19,
    city: 'Chernivtsi'
  };
  next();
});

app.use((req, res, next) => {
  req.chance = Math.random();
  req.hash.city = 'Kiev';
  next();
});

app.get('/', (req, res) => {
  res.json({
    data: req.hash,
    chance: req.chance
  });
});

app.listen(PORT, (err) => {
  if (err) return console.error(err);
  console.log(`Example app is listening at ${PORT} port`);
});
