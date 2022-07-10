// module scaffolding
const environment = {};
environment.staging = {
  port: 4000,
  envName: "staging",
  secretKey: "werputdgfdghttrmdfs;a",
  maxChecks: 5,
  twilio: {
    formPhone: "",
  },
};
environment.production = {
  port: 5000,
  envName: "production",
  secretKey: "ahkerehfdwerputdgfdghttrmdfs;a",
  maxChecks: 5,
  twilio: {
    formPhone: "",
  },
};
// determine which port was passed
const currentEnvironment =
  typeof process.env.NODE_ENV === "string" ? process.env.NODE_ENV : "staging";
// export corresponding environment object
const environmentToExport =
  typeof environment[currentEnvironment] === "object"
    ? environment[currentEnvironment]
    : environment.staging;
module.exports = environmentToExport;
