'use strict';
var fs = require("fs");
var logger = require('../constants').logger("EdgeClient");
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
        let path = request.path.replace('/appsec-configuration/v1/','');
        path = __dirname + '/' + path + '.json';
        logger.debug("replaced path: "+path);
        fs.readFile(path, (err, data) => {
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