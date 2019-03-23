const path = require("path");
const server = require(path.join(__dirname, "src", "start-io"));
const nlp = require(path.join(__dirname, "src", "nlp"));

module.exports = {
  server: server,
  nlp: nlp
};
