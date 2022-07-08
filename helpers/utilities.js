const crypto = require("crypto");
const env = require("./environment");
// module scaffolding
const utilities = {};
// parse json string to object
utilities.parseJSON = (jsonString) => {
  let output;
  try {
    output = JSON.parse(jsonString);
  } catch (error) {
    console.log("error json parse");
    return false;
  }
  return output;
};

// hashing the secret password
utilities.hash = (string) => {
  if (typeof string === "string" && string.length > 0) {
    const createHash = crypto
    .createHmac("sha256", env.secretKey)
    .update(string)
    .digest("hex");
    // console.log("hey hashing", createHash);
    return createHash;
  } else {
    return false;
  }
};
module.exports = utilities;
