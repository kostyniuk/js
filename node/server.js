'use strict';

import http from 'http';

const server = http.createServer();

server.on('request', (req, res) => {
    console.log(req.url);
    res.write('http-server');
    res.end();
})

server.listen(3000);
