'use strict';
var fs = require("fs");
var logger = require('../src/constants').logger("EdgeClient");
var URIs = require("../src/constants").URIS;

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

  get(requestUri) {
    logger.debug("URI: "+JSON.stringify(requestUri));
    let request = {
        method: "GET",
        path: requestUri,
        followRedirect: false
      };
    return new Promise((resolve, reject) => {
        let path = request.path.replace('/appsec-configuration/v1/','');
        path = __dirname + '/' + path + '.json';
        logger.debug("replaced path: "+path);
        fs.readFile(path, (err, data) => {
            if (err) {
                reject(err);
            } else {
              logger.debug(JSON.stringify(JSON.parse(data)));
                setTimeout(()=>{
                  let jsonData = JSON.parse(data);
                  let chosenData = jsonData.responses[jsonData.responseToChoose];
                  if(chosenData.httpStatus >= 200 && chosenData.httpStatus < 400 ) {
                    resolve(chosenData.response);
                  } else {
                    reject(chosenData.response);
                  }
                },2000);
            }
          });
    });
  }
}

module.exports = Edge;