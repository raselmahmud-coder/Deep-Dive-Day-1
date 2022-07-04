const url = require("url");
const { StringDecoder } = require("string_decoder");
const routes = require("../routes");
const {
  notFoundHandler,
} = require("../handlers/routeHandlers/notFoundHandler");

const handler = {};
handler.handleReqRes = (req, res) => {
  // get the url and parse it
  const parseUrl = url.parse(req.url, true);
  const path = parseUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");
  const method = req.method.toLowerCase();
  const queryObjectString = parseUrl.query;
  const headerObj = req.headers;
  const requestProperties = {
    parseUrl,
    path,
    trimmedPath,
    method,
    queryObjectString,
    headerObj,
  };
  const decoder = new StringDecoder("utf-8");
  const chosenHandler = routes[trimmedPath]
    ? routes[trimmedPath]
    : notFoundHandler;

  let realData = "";
  req.on("data", (buffer) => {
    realData += decoder.write(buffer);
  });
  req.on("end", () => {
    realData += decoder.end();
    chosenHandler(requestProperties, (statusCode, payLoad) => {
        statusCode = typeof statusCode === "number" ? statusCode : 500;
        payLoad = typeof payLoad === "object" ? payLoad : {};
        const payLoadString = JSON.stringify(payLoad);
        // return the final response
          res.writeHead(statusCode);
          res.end(payLoadString)
      });
    res.end("hello js pro");
  });
};

module.exports = handler;
