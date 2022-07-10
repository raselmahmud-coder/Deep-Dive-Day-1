// dependency
const https = require("https");
const { twilio } = require("./environment");
// module scaffolding
const notifications = {};
notifications.sendTwilioSms = (phone, sms, cb) => {
  const userPhone =
    typeof phone === "string" && phone.trim().length === 11 ? phone : false;
  const userMsg =
    typeof sms === "string" && sms.trim().length <= 1600 ? sms.trim() : false;
  if (phone && userMsg) {
    // configure the request payload
    const payLoad = {
      From: twilio.fromPhone,
      To: `+88${userPhone}`,
      Body: userMsg,
    };
    //   stringify the object
    const stringPayload = JSON.stringify(payLoad);
    const requestDetails = {
        hostname: "https://rest.nexmo.com/sms/json",
        method: "POST",
        path:""
    };
  } else {
    cb("given parameter was invalid");
  }
};

module.exports = notifications;
