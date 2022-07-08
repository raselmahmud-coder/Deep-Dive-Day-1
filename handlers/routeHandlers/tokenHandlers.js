const data = require("../../lib/data");
const utilities = require("../../helpers/utilities");
const handler = {};
handler.tokenHandler = (requestProperties, callback) => {
  const acceptedMethod = ["post", "get", "put", "delete"];
  if (acceptedMethod.indexOf(requestProperties.method) > -1) {
    handler._token[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};
handler._token = {};
handler._token.post = (requestProperties, callback) => {
  const password =
    typeof requestProperties.body.password === "string"
      ? requestProperties.body.password
      : false;
  const phone =
    typeof requestProperties.body.phone === "string" &&
    requestProperties.body.phone.length === 11
      ? requestProperties.body.phone
      : false;
  if (password && phone) {
    data.read("users", phone, (err, uData) => {
      if (!err && uData) {
        const uPasswordHash = utilities.hash(password);
        if (utilities.parseJSON(uData).password === uPasswordHash) {
          const tokenId = utilities.generateToken(20);
          const expire = Date.now() + 60 * 60 * 1000;
          const tokenObject = {
            phone,
            tokenId,
            expire,
          };
          data.create("tokens", tokenId, tokenObject, (err) => {
            if (!err) {
              callback(200, {
                token: tokenObject,
              });
            } else {
              callback(500, {
                message: "token not created",
              });
            }
          });
        } else {
          callback(404, {
            message: "password isn't valid",
          });
        }
      } else {
        callback(505, {
          message: "internal problem can't read data",
        });
      }
    });
  } else {
    callback(400, {
      message: "password and phone not correct",
    });
  }
};
// get method
handler._token.get = (requestProperties, callback) => {
  const id =
    typeof requestProperties.queryObjectString.tokenId === "string"
      ? requestProperties.queryObjectString.tokenId
      : false;

  if (id) {
    // look up the token
    data.read("tokens", id, (err, tokenData) => {
      const token = { ...utilities.parseJSON(tokenData) };
      console.log("hey token", token);
      if (!err && token) {
        callback(200, token);
      } else {
        callback(404, {
          message: "requested token not found",
        });
      }
    });
  } else {
    callback(404, {
      message: "requested token not found",
    });
  }
};

handler._token.put = (requestProperties, callback) => {
  const id =
    typeof requestProperties.body.tokenId === "string"
      ? requestProperties.body.tokenId
      : false;
  const extend =
    typeof requestProperties.body.extend === "boolean" &&
    requestProperties.body.extend === true
      ? requestProperties.body.extend
      : false;

  if (id && extend) {
      data.read("tokens", id, (err, tokenData) => {
          if (!err && tokenData) {
            let tokenObject = utilities.parseJSON(tokenData);

            if (tokenObject.expire > Date.now()) {
                tokenObject.expire = Date.now() + 60 * 60 * 1000;
                //   store the update token
                data.update("tokens", id, tokenObject, (err) => {
                  if (!err) {
                    callback(200, {
                      message: "successfully updated",
                    });
                  } else {
                    callback(500, {
                      message: "sorry, there was an error server side",
                    });
                  }
                });
              } else {
                callback(400, {
                  message: "token already expired",
                });
              }
        } else {
            callback(500, {
                message:"there is a problem reading"
            })
        }
      
    });
  } else {
    callback(404, {
      message: "requested token not valid",
    });
  }
};


handler._token.delete = (requestProperties, callback) => {
    const tokenId =
    typeof requestProperties.queryObjectString.tokenId === "string"
      ? requestProperties.queryObjectString.tokenId
            : false;
    if (tokenId) {
        // look up the user
        data.read("tokens", tokenId, (err, tokenData) => {
            if (!err && tokenData) {
                data.delete("tokens", tokenId, (err) => {
                    console.log("hey er...",err);
                    if (!err) {
                        callback(500, {
                            message:"sorry can't delete"
                        })
                    } else {
                        callback(200, {
                            message:"successfully deleted"
                        })
                        
                    }
                })
            } else {
                callback(404, {
                    message:"token problem"
                })
            }
        })
    } else {
        
    }
};

module.exports = handler;
