'use strict';

const http = require('http');
const cluster = require('cluster');
const os = require('os');
const pid = process.pid;
const cpuCount = os.cpus().length;

if (cluster.isMaster) {
  for(let i = 0; i < cpuCount - 1; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  })
};

if (cluster.isWorker) {
  require('./worker');
  console.log(`New worker started. Pid : ${pid}`);
}
