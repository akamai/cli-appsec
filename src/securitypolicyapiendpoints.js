'use strict';

let URIs = require('./constants').URIS;
let fs = require('fs');
let untildify = require('untildify');
let Config = require('./configprovider').configProvider;
let Version = require('./versionsprovider').versionProvider;
let PolicyProvider = require('./policy').policy;

class SecurityPolicyApiEndpoints {
  constructor(options) {
    this._config = new Config(options);
    this._options = options;
    this._version = new Version(options);
    this._policyProvider = new PolicyProvider(options);
  }

  getApiEndpoints() {
    return this._policyProvider.policyId().then(policyId => {
      return this._version.readResource(URIs.SECURITY_POLICY_API_ENDPOINTS, [policyId]);
    });
  }
}

module.exports = {
  securitypolicyapiendpoints: SecurityPolicyApiEndpoints
};
