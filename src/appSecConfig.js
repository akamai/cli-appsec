"use strict";

let Edge = process.env.MOCK_AKA_SEC_API == 'true' ? require("../mock/edgeClient") : require("./edgeClient");

let util = require('util');
let URIs = require("./constants").URIS;
let ConfigProvider = require('./configProvider').configProvider;
let logger = require("./constants").logger("AppSecConfig");

class AppSecConfig {

  constructor(auth) {
    this._edge = new Edge(auth);
    this._configProvider = new ConfigProvider(this._edge);
  }

  configs(options) {
    return this._configProvider.configs(options);
  }

  versions(providedConfigId) {
    let configId = this._configProvider.getConfigId(providedConfigId);
    return new Promise((resolve, reject) => {
      let versionsApi = util.format(URIs.GET_VERSIONS, configId);
      logger.debug("Versions API: " + versionsApi);
      let request = {
        method: "GET",
        path: versionsApi,
        followRedirect: false
      };
      this._edge.get(request).then(response => {
        resolve(response);
      }).catch(err => {
        reject(err);
      });
    });
  }
}

module.exports = {
  AppSecConfig: AppSecConfig
};
