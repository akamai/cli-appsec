"use strict";

let Edge = process.env.MOCK_AKA_SEC_API == 'true' ? require("../mock/edgeClient") : require("./edgeClient");

let URIs = require("./constants").URIS;
let logger = require("./constants").logger("AppSecConfig");
let ConfigResourcesReader = require('./configResourcesUtil').resourceUtil;

class AppSecConfig {

  constructor(auth) {
    this._edge = new Edge(auth);
    this._configResourceReader = new ConfigResourcesReader(this._edge);
  }

  configs(options) {
    return this._edge.get(URIs.GET_CONFIGS);
  }

  config(options) {
    //TODO Optimize 
    return this._configResourceReader.readResource(options.config, URIs.GET_CONFIG, []);
  }

  versions(options) {
    return this._configResourceReader.readResource(options.config, URIs.GET_VERSIONS, []);
  }

  version(options) {
    return this._configResourceReader.readResource(options.config, URIs.GET_VERSION, [options['version-id']]);
  }

  rules(providedConfigId) {

    let configId = this._getConfigId(providedConfigId);

    return new Promise((resolve, reject) => {
      let customRulesUrl = URIs.GET_CRB.format(configId);
      logger.debug("Attempting to get all custom rules at: " + customRulesUrl);
      let request = {
        method: "GET",
        path: customRulesUrl,
        followRedirect: false
      };
      this._edge.auth(request).send(function (data, response) {
        if (response && response.statusCode >= 200 && response.statusCode < 400) {
          let parsed = JSON.parse(response.body);
          resolve(parsed);
        } else {
          reject(data);
        }
      });
    });
  }
}

module.exports = {
  AppSecConfig: AppSecConfig
};