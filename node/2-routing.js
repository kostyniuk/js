'use strict';

const http = require('http');

const info = {
  'name' : 'Alex',
  'age' : 19,
  'city' : 'Kyiv' 
}

const routing = {
  '/': '<h1>Welcole to my server!!! </h1>',
  '/me': info, //not scalar works dynamicly
  '/me/age': info.age, //scalar assign at the beginning 
  '/me/name': info.name,
  '/api/method1': (req, res) => {
    console.log(req.url);
    return { status: res.statusCode };
  },
  '/api/method2': req => ({
    info,
    url: req.url,
    cookies: req.headers.cookie
  }),
};

const types = {
  object: JSON.stringify,
  string: s => s,
  number: n => n.toString(),
  undefined: () => 'not found',
  function: (fn, req, res) => JSON.stringify(fn(req, res)),
};

http.createServer((req, res) => {
  const data = routing[req.url];
  const type = typeof data;
  const serializer = types[type];
  const result = serializer(data, req, res);
  res.end(result);
}).listen(8000);

setInterval(() => {
  info.age++
}, 5000)