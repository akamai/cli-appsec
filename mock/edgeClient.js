'use strict';
var fs = require("fs");
var logger = require("pino")({
  level: process.env.LOG_LEVEL ? process.env.LOG_LEVEL : "error",
  prettyPrint:true,
  name:"EdgeClient"
});

var URIs = require("../constants").URIS;

var MOCK_DATA = {};
MOCK_DATA[URIs.GET_CONFIGS] = './mock/configs.json';
MOCK_DATA[URIs.GET_VERSIONS] = './mock/versions.json';

class Edge {
  constructor(auth = {
    path: "~/.edgerc",
    section: "appsec",
    debug: false,
    default: true
  }) {
      logger.debug(JSON.stringify(auth));
      console.log("::::: MOCK API ENABLED :::::");
  }

  get(request) {
    return new Promise((resolve, reject) => {
        fs.readFile(MOCK_DATA[request.path], (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(data));
            }
          });
    });
  }
}

module.exports = Edge;