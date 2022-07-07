/*
 *title:
 *description:
 *author:
 */
// Dependency
const http = require("http");
const { handleReqRes } = require("./helpers/handleReqRes");
const environment = require("./helpers/environment");
// const data = require("./lib/data");

// app object module scaffolding
const app = {};
/* 

data.delete("test", "newFile", (err) => {
  console.log("error was", err);
  // console.log("this is data", data);
}); */
// create server
app.createServer = () => {
  const server = http.createServer(app.handleReqRes);
  server.listen(environment.port, () => {
    console.log("app is listening at", environment.port);
  });
};
// handle request response
app.handleReqRes = handleReqRes;
// invoke the server
app.createServer();
