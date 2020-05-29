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
    return this._version.readResource(URIs.SLOW_POST, [this._options['policy']]);
  }

  enableSlowPost() {
    let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
    return this._version.updateResource(
      URIs.SLOW_POST,
      [this._options['policy']],
      JSON.parse(payload)
    );
  }

  disableSlowPost() {
    let protection = JSON.parse(
      fs.readFileSync(__dirname + '/../templates/protection.json', 'utf8')
    );

    protection.applySlowPostControls = false;
    return this._version.updateResource(
      URIs.POLICY_PROTECTIONS,
      [this._options['policy']],
      protection
    );
  }
}

module.exports = {
  slowPost: SlowPost
};
