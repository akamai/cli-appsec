'use strict';

let URIs = require('./constants').URIS;
let fs = require('fs');
let untildify = require('untildify');
let Version = require('./versionsprovider').versionProvider;
let PolicyProvider = require('./policy').policy;

class UrlProtection {
  constructor(options) {
    this._options = options;
    this._version = new Version(options);
    this._policyProvider = new PolicyProvider(options);
  }

  getURLProtectionPolicies() {
    return this._version.readResource(URIs.URL_PROTECTION_POLICIES, []);
  }

  getURLProtectionPolicy() {
    return this._version.readResource(URIs.URL_PROTECTION_POLICY, [
      this._options['url-protection-policy']
    ]);
  }

  deleteURLProtectionPolicy() {
    return this._version.deleteResource(URIs.URL_PROTECTION_POLICY, [
      this._options['url-protection-policy']
    ]);
  }

  createURLProtectionPolicy() {
    if (fs.existsSync(this._options['file'])) {
      let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
      let data;
      try {
        data = JSON.parse(payload);
      } catch (err) {
        throw 'The input JSON is not valid';
      }
      return this._version.createResource(URIs.URL_PROTECTION_POLICIES, [], data);
    } else {
      throw `The file does not exists: ${this._options['file']}`;
    }
  }

  updateURLProtectionPolicy() {
    if (fs.existsSync(this._options['file'])) {
      let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
      let data;
      try {
        data = JSON.parse(payload);
      } catch (err) {
        throw 'The input JSON is not valid';
      }
      return this._version.updateResource(
        URIs.URL_PROTECTION_POLICY,
        [this._options['url-protection-policy']],
        data
      );
    } else {
      throw `The file does not exists: ${this._options['file']}`;
    }
  }

  getAllURLProtectionPoliciesActions() {
    return this._policyProvider.policyId().then(policyId => {
      return this._version.readResource(URIs.URL_PROTECTION_POLICIES_ACTIONS, [policyId]);
    });
  }

  enableURLProtectionPolicyActions() {
    return this._policyProvider.policyId().then(policyId => {
      let protection = JSON.parse(
        fs.readFileSync(__dirname + '/../templates/url-protection-policy-action.json', 'utf8')
      );
      protection.action = this._options['action'];
      protection.loadSheddingAction = this._options['load-shedding-action'];
      return this._version.updateResource(
        URIs.URL_PROTECTION_POLICIES_ACTIONS_BY_ID,
        [policyId, this._options['url-protection-policy']],
        protection
      );
    });
  }

  disableURLProtectionPolicyActions() {
    return this._policyProvider.policyId().then(policyId => {
      let protection = JSON.parse(
        fs.readFileSync(__dirname + '/../templates/url-protection-policy-action.json', 'utf8')
      );
      protection.action = 'none';
      protection.loadSheddingAction = 'none';
      return this._version.updateResource(
        URIs.URL_PROTECTION_POLICIES_ACTIONS_BY_ID,
        [policyId, this._options['url-protection-policy']],
        protection
      );
    });
  }

  enableURLProtection() {
    return this._policyProvider.policyId().then(policyId => {
      let protection = JSON.parse(
        fs.readFileSync(__dirname + '/../templates/url-protection.json', 'utf8')
      );
      protection.applyUrlProtectionControls = true;
      return this._version.updateResource(URIs.POLICY_PROTECTIONS, [policyId], protection);
    });
  }

  disableURLProtection() {
    return this._policyProvider.policyId().then(policyId => {
      let protection = JSON.parse(
        fs.readFileSync(__dirname + '/../templates/url-protection.json', 'utf8')
      );
      protection.applyUrlProtectionControls = false;
      return this._version.updateResource(URIs.POLICY_PROTECTIONS, [policyId], protection);
    });
  }
}

module.exports = {
  urlProtection: UrlProtection
};
