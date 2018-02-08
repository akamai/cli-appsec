"use strict";

var URIs = require("./constants").URIS;
let logger = require("./constants").logger("ConfigProvider");

class ConfigProvider {

  constructor(edge) {
    this._edge = edge;
  }

  getConfigId(configId) {
    if (!configId) {
      if (this.configs().length == 1) {
        configId = this.configs()[0].id;
      } else {
        throw "You have more than one configuration. Please provide a configuration id to work with.";
      }
    }
    return configId;
  }

  configs(options) {
    logger.debug(JSON.stringify(options));
    logger.debug("Configs API: " + URIs.GET_CONFIGS);
    let request = {
      method: "GET",
      path: URIs.GET_CONFIGS,
      followRedirect: false
    };
    return new Promise((resolve, reject) => {
      this._edge.get(request).then(response => {
        if(options.json == true) {
          resolve(JSON.stringify(response));
        } else {
          var configIds = [];
          for (let i = 0; i < response.length; i++) {
            configIds.push(response[i].configId);
          }
          resolve(configIds.join("\n"));
        }
      }).catch(err => {
        reject(err);
      });
    });
  }
}

module.exports = {
    configProvider: ConfigProvider
};