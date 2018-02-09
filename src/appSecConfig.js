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

  versions(options) {

    return this._configProvider.getConfigId(options.config)
    .then((configId) => {
        return new Promise((resolve) => {
          let versionsApi = util.format(URIs.GET_VERSIONS, configId);
          logger.debug("Versions API: " + versionsApi);
          let request = {
            method: "GET",
            path: versionsApi,
            followRedirect: false
          };
          this._edge.get(request).then((resp)=>{resolve(resp);});
        });
      })
      .then(response => {
        if (options.json) {
          return Promise.resolve(JSON.stringify(response));
        } else {
          let versions = response.versionList;
          let versionIds = [];
          for (let i = 0; i < versions.length; i++) {
            versionIds.push(versions[i].version);
          }
          return Promise.resolve(versionIds.join("\n"));
        }
      })
      .catch(err => {
        return Promise.reject(err);
      });
  }

  version(options) {

    return this._configProvider.getConfigId(options.config)
    .then((configId) => {
        return new Promise((resolve) => {
          let versionsApi = util.format(URIs.GET_VERSION, configId, options['version-id']);
          logger.debug("Version API: " + versionsApi);
          let request = {
            method: "GET",
            path: versionsApi,
            followRedirect: false
          };
          this._edge.get(request).then((resp)=>{resolve(resp);});
        });
      })
      .then(response => {
          return Promise.resolve(JSON.stringify(response));
      })
      .catch(err => {
        return Promise.reject(err);
      });
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