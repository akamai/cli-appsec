'use strict';

let URIs = require('./constants').URIS;
let Version = require('./versionsprovider').versionProvider;

class AccountProtectionRiskAction {
  constructor(options) {
    this._options = options;
    this._version = new Version(options);
  }

  getRiskActions() {
    return this._version.readResource(URIs.ACCOUNT_PROTECTION_RISK_ACTIONS, []);
  }
}

module.exports = {
  accountProtectionRiskAction: AccountProtectionRiskAction
};
