'use strict';

let URIs = require('./constants').URIS;
//Ensures user can add paths like '~/foo'
let Version = require('./versionsprovider').versionProvider;
let PolicyProvider = require('./policy').policy;

class Mode {
  constructor(options) {
    this._options = options;
    this._version = new Version(options);
    this._policyProvider = new PolicyProvider(options);
  }

  getMode() {
    return this._policyProvider.policyId().then(policyId => {
      return this._version.readResource(URIs.MODE, [policyId]);
    });
  }

  setMode() {
    let payload = { mode: this._options.mode };
    return this._policyProvider.policyId().then(policyId => {
      return this._version.updateResource(URIs.MODE, [policyId], payload);
    });
  }
}

module.exports = {
  mode: Mode
};
