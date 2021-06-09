'use strict';

let URIs = require('./constants').URIS;
let fs = require('fs');
let untildify = require('untildify');
let Config = require('./configprovider').configProvider;
let Version = require('./versionsprovider').versionProvider;
let PolicyProvider = require('./policy').policy;

class ThreatIntel {
  constructor(options) {
    this._config = new Config(options);
    this._options = options;
    this._version = new Version(options);
    this._policyProvider = new PolicyProvider(options);
  }

  getThreatIntel() {
    return this._policyProvider.policyId().then(policyId => {
      return this._version.readResource(URIs.THREAT_INTEL, [policyId]);
    });
  }

  enableThreatIntel() {
    return this._policyProvider.policyId().then(policyId => {
      let json = { threatIntel: "on"};
      return this._version.updateResource(
        URIs.THREAT_INTEL,
        [policyId],
        json
      );
    });
  }

  disableThreatIntel() {
    return this._policyProvider.policyId().then(policyId => {
      let json = { threatIntel: "off"};
      return this._version.updateResource(
          URIs.THREAT_INTEL,
          [policyId],
          json
      );
    });
  }

}

module.exports = {
  threatIntel: ThreatIntel
};
