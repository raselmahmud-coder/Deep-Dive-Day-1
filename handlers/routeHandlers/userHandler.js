const data = require("../../lib/data");
const utilities = require("../../helpers/utilities");
const handler = {};
handler.userHandler = (requestProperties, callback) => {
  const acceptedMethod = ["post", "get", "put", "delete"];
  if (acceptedMethod.indexOf(requestProperties.method) > -1) {
    handler._user[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};
handler._user = {};
handler._user.post = (requestProperties, callback) => {
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
          password:utilities.hash(password),
          phone,
          tosAgreement,
        };
        console.log("hey obj", userObj);
        // store user in the database
            data.create("users", phone, userObj, (err) => {
          if (!err) {
            callback(200, {
              message:"you have added a user"
            })
          } else {
            callback(500, {
              error:"server side happen"
            })
          }
        })
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
handler._user.get = (requestProperties, callback) => {};
handler._user.put = (requestProperties, callback) => {};
handler._user.delete = (requestProperties, callback) => {};
module.exports = handler;
