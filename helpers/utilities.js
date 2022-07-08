const crypto = require("crypto");
const env = require("./environment");
// module scaffolding
const utilities = {};
// parse json string to object
utilities.parseJSON = (jsonString) => {
  let output;
  try {
    output = JSON.parse(jsonString);
  } catch (err) {
    console.log("error json parse",err);
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
// generate a string token for user
utilities.generateToken = (stringLength) => {
  const strLength =
    stringLength > 0 && typeof stringLength === "number" ? stringLength : false;
  if (strLength) {
    console.log("hey length", typeof strLength);
    const possibleChar = `abcdefghijklmnopqrstuvwxyz1234567890~!@#$%^&*()`;
    let output = "";
    for (let index = 0; index <= strLength; index++) {
      const pickChar = possibleChar.charAt(Math.ceil(Math.random() * strLength));
      output += pickChar;
    }
    return output;
  } else {
    return false;
  }
};
module.exports = utilities;
