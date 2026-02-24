'use strict';

let URIs = require('./constants').URIS;
let fs = require('fs');
let Version = require('./versionsprovider').versionProvider;
let PolicyProvider = require('./policy').policy;

class UrlProtection {
  constructor(options) {
    this._options = options;
    this._version = new Version(options);
    this._policyProvider = new PolicyProvider(options);
  }

  getURLProtectionRules() {
    return this._version.readResource(URIs.URL_PROTECTION_RULES, []);
  }

  getURLProtectionRule() {
    return this._version.readResource(URIs.URL_PROTECTION_RULE, [
      this._options['url-protection-rule']
    ]);
  }

  getAllURLProtectionRulesActions() {
    return this._policyProvider.policyId().then(policyId => {
      return this._version.readResource(URIs.URL_PROTECTION_RULES_ACTIONS, [policyId]);
    });
  }

  enableURLProtectionRuleActions() {
    return this._policyProvider.policyId().then(policyId => {
      let protection = JSON.parse(
        fs.readFileSync(__dirname + '/../templates/url-protection-rule-action.json', 'utf8')
      );
      protection.action = this._options['action'];
      protection.loadSheddingAction = this._options['load-shedding-action'];
      return this._version.updateResource(
        URIs.URL_PROTECTION_RULES_ACTIONS_BY_ID,
        [policyId, this._options['url-protection-rule']],
        protection
      );
    });
  }

  disableURLProtectionRuleActions() {
    return this._policyProvider.policyId().then(policyId => {
      let protection = JSON.parse(
        fs.readFileSync(__dirname + '/../templates/url-protection-rule-action.json', 'utf8')
      );
      protection.action = 'none';
      protection.loadSheddingAction = 'none';
      return this._version.updateResource(
        URIs.URL_PROTECTION_RULES_ACTIONS_BY_ID,
        [policyId, this._options['url-protection-rule']],
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
