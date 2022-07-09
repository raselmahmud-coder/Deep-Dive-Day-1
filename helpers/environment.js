// module scaffolding
const environment = {};
environment.staging = {
  port: 4000,
  envName: "staging",
  secretKey: "werputdgfdghttrmdfs;a",
  maxChecks: 5,
};
environment.production = {
  port: 5000,
  envName: "production",
  secretKey: "ahkerehfdwerputdgfdghttrmdfs;a",
  maxChecks: 5,
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
