const data = require("../../lib/data");
const utilities = require("../../helpers/utilities");
const { _token } = require("./tokenHandlers");
const handler = {};

handler.userHandler = (requestProperties, callback) => {
  const acceptedMethod = ["post", "get", "put", "delete"];
  if (acceptedMethod.indexOf(requestProperties.method) > -1) {
    handler._check[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};
handler._check = {};
handler._check.post = (requestProperties, callback) => {
  const firstName =
    typeof requestProperties.body.firstName === "string" &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : false;
  const lastName =
    typeof requestProperties.body.lastName === "string" &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName
      : false;
  const password =
    typeof requestProperties.body.password === "string" &&
    requestProperties.body.password.trim().length > 3
      ? requestProperties.body.password
      : false;
  const phone =
    typeof requestProperties.body.phone === "string" &&
    requestProperties.body.phone.length === 11
      ? requestProperties.body.phone
      : false;
  const tosAgreement =
    typeof requestProperties.body.tosAgreement === "boolean"
      ? requestProperties.body.tosAgreement
      : false;
  // console.log("client values",requestProperties);
  if (firstName && lastName && phone && password && tosAgreement) {
    // make sure user does not exist before
    data.read("users", phone, (err) => {
      if (err) {
        // do next step for file save
        const userObj = {
          firstName,
          lastName,
          password: utilities.hash(password),
          phone,
          tosAgreement,
        };
        console.log("hey obj", userObj);
        // store user in the database
        data.create("users", phone, userObj, (err) => {
          if (!err) {
            callback(200, {
              message: "you have added a user",
            });
          } else {
            callback(500, {
              error: "server side happen",
            });
          }
        });
      } else {
        callback(500, {
          error: "it's already exist in the server",
        });
      }
    });
  } else {
    callback(400, {
      error: "you have an problem in your request",
    });
  }
};
handler._check.get = (requestProperties, callback) => {
  // check the phone number if valid then pass
  const phone =
    typeof requestProperties.queryObjectString.phone === "string" &&
    requestProperties.queryObjectString.phone.trim().length === 11
      ? requestProperties.queryObjectString.phone
      : false;
  if (phone) {
    // verify the token
    const token =
      typeof requestProperties.headerObj.token === "string"
        ? requestProperties.headerObj.token
        : false;
    _token.tokenVerify(token, phone, (isToken) => {
      if (!isToken) {
        callback(403, {
          message: "Authentication failed",
        });
      } else {
        data.read("users", phone, (err, user) => {
          const reqUser = utilities.parseJSON(user);
          if (!err && reqUser) {
            delete reqUser.password;
            callback(200, reqUser);
          } else {
            callback(500, {
              message: "it's been internal error",
            });
          }
        });
      }
    });
  } else {
    callback(404, {
      message: "not found",
    });
  }
};
handler._check.put = (requestProperties, callback) => {
  // validation
  const firstName =
    typeof requestProperties.body.firstName === "string" &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : false;
  const lastName =
    typeof requestProperties.body.lastName === "string" &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName
      : false;
  const password =
    typeof requestProperties.body.password === "string" &&
    requestProperties.body.password.trim().length > 3
      ? requestProperties.body.password
      : false;
  const phone =
    typeof requestProperties.body.phone === "string" &&
    requestProperties.body.phone.length === 11
      ? requestProperties.body.phone
      : false;
  if (phone) {
    // verify the token
    const token =
      typeof requestProperties.headerObj.token === "string"
        ? requestProperties.headerObj.token
        : false;
    _token.tokenVerify(token, phone, (isToken) => {
      if (!isToken) {
        callback(403, {
          message: "Authentication failed",
        });
      } else {
        if (firstName || lastName || password) {
          data.read("users", phone, (err, uData) => {
            const userData = { ...utilities.parseJSON(uData) };
            if (!err && userData) {
              if (firstName) {
                userData.firstName = firstName;
              }
              if (lastName) {
                userData.lastName = lastName;
              }
              if (password) {
                userData.password = utilities.hash(password);
              }

              // update the data in the database
              data.update("users", phone, userData, (err) => {
                if (!err) {
                  callback(200, {
                    message: "successfully user was updated",
                  });
                } else {
                  callback(500, {
                    message: "it's server side error happened",
                  });
                }
              });
            } else {
              callback(400, { message: "sorry we could not found" });
            }
          });
        } else {
          callback(400, { message: "invalid request" });
        }
      }
    });
  } else {
    callback(400, {
      message: "invalid number please try again later",
    });
  }
};
// @TODO USER AUTHENTICATION
handler._check.delete = (requestProperties, callback) => {
  const phone =
    typeof requestProperties.queryObjectString.phone === "string" &&
    requestProperties.queryObjectString.phone.trim().length === 11
      ? requestProperties.queryObjectString.phone
      : false;
  if (phone) {
    // verify the token
    const token =
      typeof requestProperties.headerObj.token === "string"
        ? requestProperties.headerObj.token
        : false;
    _token.tokenVerify(token, phone, (isToken) => {
      if (!isToken) {
        callback(403, {
          message: "Authentication failed",
        });
      } else {
        data.read("users", phone, (readErr, uData) => {
          if (!readErr && uData) {
            data.delete("users", phone, (err) => {
              if (!err) {
                callback(500, {
                  message: "sorry it's internal error",
                });
              } else {
                callback(200, {
                  message: "successfully user was deleted",
                });
              }
            });
          } else {
            callback(404, {
              message:
                "doesn't exist user or you haven't rights to delete user",
            });
          }
        });
      }
    });
  } else {
    callback(404, {
      message: "not found any phone number",
    });
  }
};
module.exports = handler;
