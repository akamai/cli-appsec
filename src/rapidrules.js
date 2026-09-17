'use strict';

let URIs = require('./constants').URIS;
let fs = require('fs');
let Version = require('./versionsprovider').versionProvider;
let PolicyProvider = require('./policy').policy;

class RapidRules {
  constructor(options) {
    this._options = options;
    this._version = new Version(options);
    this._policyProvider = new PolicyProvider(options);
  }

  getRapidRules() {
    return this._policyProvider.policyId().then(policyId => {
      let uri = URIs.RAPID_RULES;
      if (this._options['include-expiry-details']) {
        uri = uri + '?includeExpiryDetails=true';
      }
      return this._version.readResource(uri, [policyId]);
    });
  }

  toggleRapidRules(enabled) {
    return this._policyProvider.policyId().then(policyId => {
      let json = fs.readFileSync(__dirname + '/../templates/rapid-rules-status.json', 'utf8');
      let payload = JSON.parse(json);
      payload.enabled = enabled;
      return this._version.updateResource(URIs.RAPID_RULES_STATUS, [policyId], payload);
    });
  }

  getRapidRuleDefaultAction() {
    return this._policyProvider.policyId().then(policyId => {
      return this._version.readResource(URIs.RAPID_RULES_DEFAULT_ACTION, [policyId]);
    });
  }

  updateRapidRuleDefaultAction() {
    return this._policyProvider.policyId().then(policyId => {
      let protection = JSON.parse(fs.readFileSync(__dirname + '/../templates/action.json', 'utf8'));
      protection.action = this._options['action'];
      return this._version.updateResource(URIs.RAPID_RULES_DEFAULT_ACTION, [policyId], protection);
    });
  }
}

module.exports = {
  rapidRules: RapidRules
};
