'use strict';

let URIs = require('./constants').URIS;
let fs = require('fs');
let untildify = require('untildify');
let Config = require('./configprovider').configProvider;
let Version = require('./versionsprovider').versionProvider;
let PolicyProvider = require('./policy').policy;

class IpGeoFirewall {
  constructor(options) {
    this._config = new Config(options);
    this._options = options;
    this._version = new Version(options);
    this._policyProvider = new PolicyProvider(options);
  }

  getIpGeoFirewall() {
    return this._policyProvider.policyId().then(policyId => {
      return this._version.readResource(URIs.IP_GEO_FIREWALL, [policyId]);
    });
  }
}

module.exports = {
  ipgeofirewall: IpGeoFirewall
};
