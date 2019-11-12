'use strict';

const express = require('express');
const app = express();
const path = require('path');

const PORT = 3000;

app.use('/static', express.static(path.join(__dirname, 'public')));

const logger = (req, res, next) => {
  console.log('Logger printed something');
  next();
};


const requestTime = function(req, res, next) {
  req.requestTime = Date.now();
  next();
};

app.use(logger);

app.use(requestTime);

app.get('/', (req, res) => {
  let responseText = 'Hello World!<br>';
  responseText += '<small>Requested at: ' + req.requestTime + '</small>';
  res.send(responseText);
});

app.get('/user/:id', (req, res, next) => {
  // if the user ID is 0, skip to the next route
  if (req.params.id === '0') next('route');
  // next('route') allows us to have same paths and methods
  else next();
}, (req, res) => {
  res.send(`Not 0, but ${req.params.id}`);
});

app.get('/user/:id', (req, res) => {
  res.send(`special : ${req.params.id}`);
});

app.listen(PORT, (err) => {
  if (err) return console.error(err);
  console.log(`Example app is listening at http://localhost:${PORT} `);
});
