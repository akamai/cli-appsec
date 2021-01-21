'use strict';

let URIs = require('./constants').URIS;
let fs = require('fs');
let Config = require('./configprovider').configProvider;
let Version = require('./versionsprovider').versionProvider;
let PolicyProvider = require('./policy').policy;

class ApiConstraint {
  constructor(options) {
    this._config = new Config(options);
    this._options = options;
    this._version = new Version(options);
    this._policyProvider = new PolicyProvider(options);
  }

  getApiConstraintAction() {
    return this._policyProvider.policyId().then(policyId => {
      return this._version.readResource(URIs.API_CONSTRAINT, [policyId]);
    });
  }

  enableApiConstraintAction() {
    return this._policyProvider.policyId().then(policyId => {
      let action = JSON.parse(fs.readFileSync(__dirname + '/../templates/action.json', 'utf8'));
      action.action = this._options['action'];
      this._api = this._options['api'];
      if (!this._api) {
        return this._version.updateResource(URIs.API_CONSTRAINT, [policyId], action);
      } else {
        return this._version.updateResource(URIs.API_ID_CONSTRAINT, [policyId, this._api], action);
      }
    });
  }

  disableApiConstraint() {
    return this._policyProvider.policyId().then(policyId => {
      this._api = this._options['api'];
      if (!this._api) {
        let protection = JSON.parse(
          fs.readFileSync(__dirname + '/../templates/protection.json', 'utf8')
        );
        protection.applyApiConstraints = false;
        return this._version.updateResource(URIs.POLICY_PROTECTIONS, [policyId], protection);
      } else {
        let action = JSON.parse(fs.readFileSync(__dirname + '/../templates/action.json', 'utf8'));
        action.action = 'none';
        return this._version.updateResource(URIs.API_ID_CONSTRAINT, [policyId, this._api], action);
      }
    });
  }
}

module.exports = {
  apiconstraint: ApiConstraint
};
