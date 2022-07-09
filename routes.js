const { checkHandler } = require("./handlers/routeHandlers/checkHandler");
const { sampleHandler } = require("./handlers/routeHandlers/sampleHandlers");
const { tokenHandler } = require("./handlers/routeHandlers/tokenHandlers");
const { userHandler } = require("./handlers/routeHandlers/userHandler");
const routes = {
  sample: sampleHandler,
  user: userHandler,
  token: tokenHandler,
  check: checkHandler,
};

module.exports = routes;
