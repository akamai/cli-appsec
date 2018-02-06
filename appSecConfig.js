"use strict";

let Edge = require("./edgeClient");
//let untildify = require("untildify");
require("string-format");

var logger = require('pino')({
  level: process.env.LOG_LEVEL ? process.env.LOG_LEVEL : "error",
  prettyPrint: true,
  name: "AppSecConfig"
});


const GET_CONFIGS = "/appsec-configuration/v1/configs";
const GET_VERSIONS = "/appsec-configuration/v1/configs/{}/versions";
const GET_CRB = "/appsec-resource/v1/configs/{}/custom-rules";

class AppSecConfig {

  constructor(auth) {
    this._edge = new Edge(auth);
  }

  _getConfigId(configId) {
    if (!configId) {
      if (this.configs().length == 1) {
        configId = this.configs()[0].id;
      } else {
        throw "You have more than one configuration. Please provide a configuration id to work with.";
      }
    }
  }

  configs() {
    logger.debug("Versions API: " + GET_CONFIGS);
    let request = {
      method: "GET",
      path: GET_CONFIGS,
      followRedirect: false
    };
    return new Promise((resolve, reject) => {
      this._edge.get(request).then(response => {
        var configIds = [];
        for (let i = 0; i < response.length; i++) {
          configIds.push(response[i].configId);
        }
        resolve(configIds);
      }).catch(err => {
        reject(err);
      });
    });
  }

    versions(providedConfigId) {

      let configId = this._getConfigId(providedConfigId);

      return new Promise((resolve, reject) => {
          let versionsApi = GET_VERSIONS.format(configId);
          logger.debug("Versions API: " + versionsApi);
          let request = {
              method: "GET",
              path: versionsApi,
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
    rules(providedConfigId) {

        let configId = this._getConfigId(providedConfigId);

        return new Promise((resolve, reject) => {
            let customRulesUrl = GET_CRB.format(configId);
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

module.exports = AppSecConfig;