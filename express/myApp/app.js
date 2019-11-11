'use strict';

const express = require('express');
const app = express();

const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!!!');
});

app.post('/', (req, res) => {
  res.send('Get a POST request');
});

app.put('/', (req, res) => {
  res.send('Get a UPDATE request');
});

app.delete('/', (req, res) => {
  res.send('Get a DELETE request');
});

app.get('/users/:usedID/books/:bookId', (req, res) => {
  const { params } = req;
  res.send({ params });
});

app.get('/flights/:from-:to', (req, res) => {
  const { params } = req;
  res.send(`The flight is from ${params.from} to ${params.to}`);
});

app.get('/subTwo/:first-:second', (req, res) => {
  const { params } = req;
  res.send(`The sum of ${params.first} and ${params.second} is 
  ${eval(`${params.first}-${params.second}`)}`);
});

app.listen(PORT, (err) => {
  if (err) return console.error(err);
  console.log(`Example app is listening at http://localhost:${PORT} `);
});
