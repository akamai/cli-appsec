'use strict';

let URIs = require('./constants').URIS;
let Config = require('./configprovider').configProvider;
let Version = require('./versionsprovider').versionProvider;
let PolicyProvider = require('./policy').policy;

class UrlProtection {
  constructor(options) {
    this._config = new Config(options);
    this._options = options;
    this._version = new Version(options);
    this._policyProvider = new PolicyProvider(options);
  }

  getAllURLProtectionRulesActions() {
    return this._policyProvider.policyId().then(policyId => {
      return this._version.readResource(URIs.URL_PROTECTION_RULES_ACTIONS, [policyId]);
    });
  }
}

module.exports = {
  urlProtection: UrlProtection
};
