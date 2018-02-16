'use strict';

let URIs = require('./constants').URIS;
let logger = require('./constants').logger('FirewallPolicy');
let Version = require('./versionsprovider').versionProvider;

class FirewallPolicy {
  constructor(options) {
    this._version = new Version(options);
  }

  policies() {
    return this._version.readResource(URIs.FIREWALL_POLICIES, []);
  }
}

module.exports = {
  policy: FirewallPolicy
};
