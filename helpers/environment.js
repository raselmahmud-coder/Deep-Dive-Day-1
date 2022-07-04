// module scaffolding
const environment = {};
environment.staging = {
  port: 4000,
  envName: "staging",
};
environment.production = {
  port: 5000,
  envName: "production",
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
