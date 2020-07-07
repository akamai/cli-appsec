'use strict';

let URIs = require('./constants').URIS;
let fs = require('fs');
let untildify = require('untildify');
let Config = require('./configprovider').configProvider;
let Version = require('./versionsprovider').versionProvider;
let PolicyProvider = require('./policy').policy;

class EvalRules {
  constructor(options) {
    this._config = new Config(options);
    this._options = options;
    this._version = new Version(options);
    this._policyProvider = new PolicyProvider(options);
  }

  getEvalRulesActions() {
    return this._policyProvider.policyId().then(policyId => {
      return this._version.readResource(URIs.EVAL_RULE_ACTIONS, [policyId]);
    });
  }

  getEvalRuleAction() {
    return this._policyProvider.policyId().then(policyId => {
      return this._version.readResource(URIs.EVAL_RULE_ACTION, [policyId, this._options['ruleId']]);
    });
  }

  enableEvalRuleAction() {
    return this._policyProvider.policyId().then(policyId => {
      let protection = JSON.parse(fs.readFileSync(__dirname + '/../templates/action.json', 'utf8'));
      protection.action = this._options['action'];
      return this._version.updateResource(
        URIs.EVAL_RULE_ACTION,
        [policyId, this._options['ruleId']],
        protection
      );
    });
  }

  disableEvalRuleAction() {
    return this._policyProvider.policyId().then(policyId => {
      let protection = JSON.parse(fs.readFileSync(__dirname + '/../templates/action.json', 'utf8'));
      protection.action = 'none';
      return this._version.updateResource(
        URIs.EVAL_RULE_ACTION,
        [policyId, this._options['ruleId']],
        protection
      );
    });
  }
}

module.exports = {
  evalrules: EvalRules
};
