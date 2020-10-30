'use strict';

let URIs = require('./constants').URIS;
let Config = require('./configprovider').configProvider;
let Version = require('./versionsprovider').versionProvider;
let PolicyProvider = require('./policy').policy;

class APIEndpoints {
  constructor(options) {
    this._config = new Config(options);
    this._options = options;
    this._version = new Version(options);
    this._policyProvider = new PolicyProvider(options);
  }

  getAllAPIEndpoints() {
    if (this._options.policy) {
      return this._policyProvider.policyId().then(policyId => {
        return this._version.readResource(URIs.SECURITY_POLICY_API_ENDPOINTS, [policyId]);
      });
    }
    return this._version.readResource(URIs.API_ENDPOINTS, []);
  }
}

module.exports = {
  apiEndpoints: APIEndpoints
};
