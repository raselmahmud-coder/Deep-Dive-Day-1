/*
 *title:
 *description:
 *author:
 */
// Dependency
const http = require("http");
const { handleReqRes } = require("./helpers/handleReqRes");
const environment = require('./helpers/environment');

// app object module scaffolding
const app = {};
// create server
app.createServer = () => {
  const server = http.createServer(app.handleReqRes);
  server.listen(environment.port, () => {
    console.log("app is listening at",environment.port);
  });
};
// handle request response
app.handleReqRes = handleReqRes;
// invoke the server
app.createServer();
