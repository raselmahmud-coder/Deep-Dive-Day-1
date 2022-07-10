/*
 *title:
 *description:
 *author:
 */
// Dependency
const data = require("./data");
const url = require("url");
const http = require("http");
const https = require("https");
const utilities = require("../helpers/utilities");
// worker object module scaffolding
const worker = {};
// look up the all checks info
worker.gatherAllChecks = () => {
  data.list("checks", (err1, checks) => {
    if (!err1 && checks) {
      checks.forEach((check) => {
        // read all checkData
        data.read("checks", check, (err2, originData) => {
          if (!err2 && originData) {
            worker.validateCheck(utilities.parseJSON(originData));
          } else {
            console.log(err2);
          }
        });
      });
    } else {
      console.log(err);
    }
  });
};

worker.validateCheck = (originData) => {
  if (originData && originData.id) {
    originData.state =
      typeof originData.state === "string" &&
      ["up", "down"].indexOf(originData.state) > -1
        ? originData.state
        : "down";
    originData.lastChecked =
      typeof originData.lastChecked === "number" && originData.lastChecked > 0
        ? originData.lastChecked
        : false;
    //   pass the perform checked
    worker.performChecked(originData);
  } else {
    console.log("you must provide an id");
  }
};
// worker perform check
worker.performChecked = (originData) => {
  // prepare the initial check outcome
  let checkOutCome = {
    error: false,
    responseCode: false,
  };
  // mark the outcome not sent yet
  let outComeSent = false;
  // parse the url path, host name
  const parsedUrl = url.parse(
    `${originData.protocol}://${originData.url}`,
    true
  );
  const hostName = parsedUrl.hostname;
  const path = parsedUrl.path;
  // construct the request for http or https
  const requestDetails = {
    protocol: `${originData.protocol}:`,
    hostname: hostName,
    method: `${originData.method.toUpperCase()}`,
    path,
    timeout: `${originData.timeOutSeconds * 1000}`,
  };
  const protocolToUse = originData.protocol === "http" ? http : https;
  const req = protocolToUse.request(requestDetails, (res) => {
    // grab the status code this res
    const status = res.statusCode;
    //   update the check outcome and pass to the next step
    checkOutCome.responseCode = status;
    if (!outComeSent) {
      worker.processCheckOutcome(originData, checkOutCome);
      outComeSent: true;
    }
  });
  req.on("error", (e) => {
    checkOutCome = {
      error: true,
      value: e,
    };
    //   update the check outcome and pass to the next step
    if (!outComeSent) {
      worker.processCheckOutcome(originData, checkOutCome);
      outComeSent: true;
    }
  });
  req.on("timeout", (e) => {
    checkOutCome = {
      error: true,
      value: "timeout",
    };
    //   update the check outcome and pass to the next step
    if (!outComeSent) {
      worker.processCheckOutcome(originData, checkOutCome);
      outComeSent: true;
    }
  });
  req.end();
};
worker.processCheckOutcome = (originData, checkOutCome) => {
  // check if the checks outcome up or down
  const state =
    !checkOutCome.error &&
    checkOutCome.responseCode &&
    originData.successCodes.indexOf(checkOutCome.responseCode) > -1
      ? "up"
      : "down";
  // decide whether we should start alert user or not
  const alertWant =
    originData.lastChecked && originData.state !== state ? true : false;
  // update the checks data
  let newCheckData = originData;
  newCheckData.state = state;
  newCheckData.lastChecked = Date.now();
  // update the checks to disk
  data.update("checks", newCheckData.id, newCheckData, (err) => {
    if (!err) {
      if (alertWant) {
        worker.alertUserToStatusChange(newCheckData);
      } else {
        console.log("alert is no need at this time");
      }
    } else {
      console.log("Error occurred update the data");
    }
  });
};
// sent sms to the user if state change
worker.alertUserToStatusChange = (newCheckData) => {
    const msg = `Alert: your check for ${newCheckData.method.toUpperCase()} ${newCheckData.protocol}://${newCheckData.url} is currently ${newCheckData.state}`;

    // notification function goes here
}
worker.loop = () => {
  setInterval(() => {
    worker.gatherAllChecks();
  }, 1000 * 60);
};
worker.init = () => {
  worker.gatherAllChecks();
  // execute all the invoke function
  worker.loop();
};
module.exports = worker;
