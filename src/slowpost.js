'use strict';

let URIs = require('./constants').URIS;
//needed to pass files to PUT/POST
let fs = require('fs');
//Ensures user can add paths like '~/foo'
let untildify = require('untildify');
let Config = require('./configprovider').configProvider;
let Version = require('./versionsprovider').versionProvider;
let PolicyProvider = require('./policy').policy;
class SlowPost {
  constructor(options) {
    this._config = new Config(options);
    this._options = options;
    this._version = new Version(options);
    this._policyProvider = new PolicyProvider(options);
  }

  getSlowPost() {
    return this._policyProvider.policyId().then(policyId => {
      return this._version.readResource(URIs.SLOW_POST, [policyId]);
    });
  }

  enableSlowPost() {
    return this._policyProvider.policyId().then(policyId => {
      let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
      return this._version.updateResource(URIs.SLOW_POST, [policyId], JSON.parse(payload));
    });
  }

  disableSlowPost() {
    return this._policyProvider.policyId().then(policyId => {
      let protection = JSON.parse(
        fs.readFileSync(__dirname + '/../templates/protection.json', 'utf8')
      );

      protection.applySlowPostControls = false;
      return this._version.updateResource(URIs.POLICY_PROTECTIONS, [policyId], protection);
    });
  }
}

module.exports = {
  slowPost: SlowPost
};
