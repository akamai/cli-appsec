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
}

module.exports = {
  AppSecConfig: AppSecConfig
};