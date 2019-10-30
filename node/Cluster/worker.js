'use strict';

const http = require('http');
const pid = process.pid;

http.createServer((req, res) => {
  res.end('<h1> My server </h1>')
}).listen(8000, () => {
  console.log('Server is started')
});
