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
  console.log('ID:', req.params.id);
  next();
}, (req, res) => {
  res.send('User Info');
});

// handler for the /user/:id path, which prints the user ID
// won't be ever get called
app.get('/user/:id', (req, res) => {
  res.end(req.params.id);
});

app.listen(PORT, (err) => {
  if (err) return console.error(err);
  console.log(`Example app is listening at http://localhost:${PORT} `);
});
