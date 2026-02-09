'use strict';

let URIs = require('./constants').URIS;
let Config = require('./configprovider').configProvider;
let Version = require('./versionsprovider').versionProvider;
let PolicyProvider = require('./policy').policy;

class WafRuleset {
  constructor(options) {
    this._config = new Config(options);
    this._options = options;
    this._version = new Version(options);
    this._policyProvider = new PolicyProvider(options);
  }

  getWafRuleset() {
    return this._policyProvider.policyId().then(policyId => {
      return this._version.readResource(URIs.WAF_RULESET, [policyId]);
    });
  }
}

module.exports = {
  wafRuleset: WafRuleset
};
