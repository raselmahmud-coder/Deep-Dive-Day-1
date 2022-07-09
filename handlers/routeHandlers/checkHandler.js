const data = require("../../lib/data");
const utilities = require("../../helpers/utilities");
const { _token } = require("./tokenHandlers");
const { maxChecks } = require("../../helpers/environment");
const handler = {};

handler.checkHandler = (requestProperties, callback) => {
  const acceptedMethod = ["post", "get", "put", "delete"];
  if (acceptedMethod.indexOf(requestProperties.method) > -1) {
    handler._check[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};
handler._check = {};
handler._check.post = (requestProperties, callback) => {
  const protocol =
    typeof requestProperties.body.protocol === "string" &&
    ["http", "https"].indexOf(requestProperties.body.protocol) > -1
      ? requestProperties.body.protocol
      : false;
  const url =
    typeof requestProperties.body.url === "string" &&
    requestProperties.body.url.trim().length > 0
      ? requestProperties.body.url
      : false;
  const method =
    typeof requestProperties.body.method === "string" &&
    ["GET", "POST", "PUT", "DELETE"].indexOf(requestProperties.body.method) > -1
      ? requestProperties.body.method
      : false;
  const successCodes =
    typeof requestProperties.body.successCodes === "object" &&
    requestProperties.body.successCodes instanceof Array
      ? requestProperties.body.successCodes
      : false;
  const timeOutSeconds =
    typeof requestProperties.body.timeOutSeconds === "number" &&
    requestProperties.body.timeOutSeconds % 1 === 0 &&
    requestProperties.body.timeOutSeconds >= 1 &&
    requestProperties.body.timeOutSeconds <= 5
      ? requestProperties.body.timeOutSeconds
      : false;
  if (protocol && url && method && successCodes && timeOutSeconds) {
    // verify the token
    const token =
      typeof requestProperties.headerObj.token === "string"
        ? requestProperties.headerObj.token
        : false;
    //  look up the user phone number by reading the token
    data.read("tokens", token, (err, tokenData) => {
      if (!err && tokenData) {
        const phone = utilities.parseJSON(tokenData).phone;
        // look up the user data
        data.read("users", phone, (err, uData) => {
          if (!err && uData) {
            _token.tokenVerify(token, phone, (isToken) => {
              if (isToken) {
                const userObject = utilities.parseJSON(uData);
                const userChecks =
                  typeof userObject.checks === "object" &&
                  userObject.checks instanceof Array
                    ? userObject.checks
                    : [];
                if (userChecks.length < maxChecks) {
                  const checkId = utilities.generateToken(20);
                  const checkObject = {
                    id: checkId,
                    userPhone: phone,
                    protocol,
                    url,
                    method,
                    successCodes,
                    timeOutSeconds,
                  };
                  data.create("checks", checkId, checkObject, (err) => {
                    if (!err) {
                      // add check id to the user's object
                      userObject.checks = userChecks;
                      userObject.checks.push(checkId);
                      // now update the user
                      data.update("users", phone, userObject, (err) => {
                        if (!err) {
                          callback(200, checkObject);
                        } else {
                          callback(500, {
                            message: "user can't update",
                          });
                        }
                      });
                    } else {
                      callback(500, {
                        message: "there was a internal problem",
                      });
                    }
                  });
                } else {
                  callback(401, {
                    message: "user reached max checks limit",
                  });
                }
              } else {
                callback(404, {
                  message: "token is not valid",
                });
              }
            });
          } else {
            callback(403, {
              message: "user does not exist",
            });
          }
        });
      } else {
        callback(403, {
          message: "Authentication failed",
        });
      }
    });
  } else {
    callback(400, {
      message: "you have a problem in your request",
    });
  }
};

handler._check.get = (requestProperties, callback) => {
  // check the phone number if valid then pass
  const id =
    typeof requestProperties.queryObjectString.id === "string" &&
    requestProperties.queryObjectString.id.trim().length > 0
      ? requestProperties.queryObjectString.id
      : false;
  if (id) {
    data.read("checks", id, (err, checkData) => {
      if (!err && checkData) {
        // verify the token
        const token =
          typeof requestProperties.headerObj.token === "string"
            ? requestProperties.headerObj.token
            : false;
        const phone = utilities.parseJSON(checkData).userPhone;
        _token.tokenVerify(token, phone, (isToken) => {
          if (isToken) {
            callback(200, utilities.parseJSON(checkData));
          } else {
            callback(403, {
              message: "authentication failed",
            });
          }
        });
      } else {
        callback(404, {
          message: "not found any data",
        });
      }
    });
  } else {
    callback(404, {
      message: "not valid",
    });
  }
};
handler._check.put = (requestProperties, callback) => {
  const id =
    typeof requestProperties.body.id === "string" &&
    requestProperties.body.id.trim().length > 0
      ? requestProperties.body.id
      : false;
  const protocol =
    typeof requestProperties.body.protocol === "string" &&
    ["http", "https"].indexOf(requestProperties.body.protocol) > -1
      ? requestProperties.body.protocol
      : false;
  const url =
    typeof requestProperties.body.url === "string" &&
    requestProperties.body.url.trim().length > 0
      ? requestProperties.body.url
      : false;
  const method =
    typeof requestProperties.body.method === "string" &&
    ["GET", "POST", "PUT", "DELETE"].indexOf(requestProperties.body.method) > -1
      ? requestProperties.body.method
      : false;
  const successCodes =
    typeof requestProperties.body.successCodes === "object" &&
    requestProperties.body.successCodes instanceof Array
      ? requestProperties.body.successCodes
      : false;
  const timeOutSeconds =
    typeof requestProperties.body.timeOutSeconds === "number" &&
    requestProperties.body.timeOutSeconds % 1 === 0 &&
    requestProperties.body.timeOutSeconds >= 1 &&
    requestProperties.body.timeOutSeconds <= 5
      ? requestProperties.body.timeOutSeconds
      : false;

  if (id && (protocol || url || method || successCodes || timeOutSeconds)) {
    data.read("checks", id, (err, checkData) => {
      if (!err && checkData) {
        const checkObject = utilities.parseJSON(checkData);
        const token =
          typeof requestProperties.headerObj.token === "string"
            ? requestProperties.headerObj.token
            : false;
            _token.tokenVerify(token, checkObject.userPhone, (isToken) => {
          console.log("check obj",token)
          console.log("check obj",checkObject.userPhone)
          if (isToken) {
            if (protocol) {
              checkObject.protocol = protocol;
            }
            if (url) {
              checkObject.url = url;
            }
            if (method) {
              checkObject.method = method;
            }
            if (successCodes) {
              checkObject.successCodes = successCodes;
            }
            if (timeOutSeconds) {
              checkObject.timeOutSeconds = timeOutSeconds;
            }
            // update the data
            data.update("checks", id, checkObject, (err) => {
              if (!err) {
                callback(200, checkObject);
              } else {
                callback(500, {
                  message: "could not update your data",
                });
              }
            });
          } else {
            callback(403, {
              message: "token authentication failed",
            });
          }
        });
      } else {
        callback(404, {
          message: "could not found data",
        });
      }
    });
  } else {
    callback(404, {
      message: "your request is invalid...",
    });
  }
};
handler._check.delete = (requestProperties, callback) => {};
module.exports = handler;
