'use strict';

let URIs = require('./constants').URIS;
let Config = require('./configprovider').configProvider;
let Version = require('./versionsprovider').versionProvider;
class APIEndpoints {
  constructor(options) {
    this._config = new Config(options);
    this._options = options;
    this._version = new Version(options);
  }

  getAllAPIEndpoints() {
    return this._version.readResource(URIs.API_ENDPOINTS, []);
  }
}

module.exports = {
  apiEndpoints: APIEndpoints
};
