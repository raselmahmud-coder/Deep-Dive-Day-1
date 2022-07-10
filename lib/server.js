/*
 *title:
 *description:
 *author:
 */
// Dependency
const http = require("http");
const { handleReqRes } = require("../helpers/handleReqRes");
const environment = require("../helpers/environment");

// server object module scaffolding
const server = {};
server.config = {
  port: 4000,
};

// create server
server.createServer = () => {
  const createServerVar = http.createServer(server.handleReqRes);
  createServerVar.listen(environment.port, () => {
    console.log("server is listening at", environment.port);
  });
};
// handle request response
server.handleReqRes = handleReqRes;
server.init = () => {
  // invoke the server
  server.createServer();
};
module.exports = server;
