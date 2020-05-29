'use strict';

let URIs = require('./constants').URIS;
//needed to pass files to PUT/POST
let fs = require('fs');
//Ensures user can add paths like '~/foo'
let untildify = require('untildify');
let Config = require('./configprovider').configProvider;
let Version = require('./versionsprovider').versionProvider;
let PolicyProvider = require('./policy').policy;
class RatePolicy {
  constructor(options) {
    this._config = new Config(options);
    this._options = options;
    this._version = new Version(options);
    this._policyProvider = new PolicyProvider(options);
  }
  getAllRatePolicies() {
    return this._version.readResource(URIs.RATE_POLICIES, []);
  }

  getRatePolicy() {
    return this._version.readResource(URIs.RATE_POLICY, [this._options['rate-policy']]);
  }

  deleteRatePolicy() {
    return this._version.deleteResource(URIs.RATE_POLICY, [this._options['rate-policy']]);
  }

  createRatePolicy() {
    let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
    return this._version.createResource(URIs.RATE_POLICIES, [], JSON.parse(payload));
  }

  updateRatePolicy() {
    let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
    return this._version.updateResource(
      URIs.RATE_POLICY,
      [this._options['rate-policy']],
      JSON.parse(payload)
    );
  }

  getAllRatePolicyActions() {
    return this._version.readResource(URIs.RATE_POLICIES_ACTION, [this._options['policy']]);
  }

  enableRatePolicy() {
    let action = JSON.parse(
      fs.readFileSync(__dirname + '/../templates/ratepolicy-action.json', 'utf8')
    );
    action.ipv4Action = this._options['ipv4-action'];
    action.ipv6Action = this._options['ipv6-action'];
    return this._version.updateResource(
      URIs.RATE_POLICY_ACTION,
      [this._options['policy'], this._options['rate-policy']],
      action
    );
  }

  disableRatePolicy() {
    let action = JSON.parse(
      fs.readFileSync(__dirname + '/../templates/ratepolicy-action.json', 'utf8')
    );
    action.ipv4Action = 'none';
    action.ipv6Action = 'none';
    return this._version.updateResource(
      URIs.RATE_POLICY_ACTION,
      [this._options['policy'], this._options['rate-policy']],
      action
    );
  }
}

module.exports = {
  ratePolicy: RatePolicy
};
