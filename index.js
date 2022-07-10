/*
 *title:
 *description:
 *author:
 */
// Dependency
const server = require('./lib/server')
const worker = require('./lib/worker')

// app object module scaffolding
const app = {};
app.init = () => {
  // start the server
  server.init()
  // start the worker
  worker.init()
}
app.init()
module.exports = app;
