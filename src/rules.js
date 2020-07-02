'use strict';

let URIs = require('./constants').URIS;
let fs = require('fs');
let untildify = require('untildify');
let Config = require('./configprovider').configProvider;
let Version = require('./versionsprovider').versionProvider;
let PolicyProvider = require('./policy').policy;

class Rules {
  constructor(options) {
    this._config = new Config(options);
    this._options = options;
    this._version = new Version(options);
    this._policyProvider = new PolicyProvider(options);
  }

  getRulesActions() {
    return this._policyProvider.policyId().then(policyId => {
      return this._version.readResource(URIs.RULE_ACTIONS, [policyId]);
    });
  }

  getRuleAction() {
    return this._policyProvider.policyId().then(policyId => {
      return this._version.readResource(URIs.RULE_ACTION, [policyId, this._options['ruleId']]);
    });
  }

  enableRuleAction() {
    return this._policyProvider.policyId().then(policyId => {
      let protection = JSON.parse(fs.readFileSync(__dirname + '/../templates/action.json', 'utf8'));
      protection.action = this._options['action'];
      return this._version.updateResource(
        URIs.RULE_ACTION,
        [policyId, this._options['ruleId']],
        protection
      );
    });
  }

  disableRuleAction() {
    return this._policyProvider.policyId().then(policyId => {
      let protection = JSON.parse(fs.readFileSync(__dirname + '/../templates/action.json', 'utf8'));
      protection.action = 'none';
      return this._version.updateResource(
        URIs.RULE_ACTION,
        [policyId, this._options['ruleId']],
        protection
      );
    });
  }

  getRuleConditionException() {
    return this._policyProvider.policyId().then(policyId => {
      return this._version.readResource(URIs.RULE_CONDITION_EXCEPTION, [
        policyId,
        this._options['ruleId']
      ]);
    });
  }

  updateRuleConditionException() {
    if (fs.existsSync(this._options['file'])) {
      let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
      let data;
      try {
        data = JSON.parse(payload);
      } catch (err) {
        throw 'The input JSON is not valid';
      }
      return this._policyProvider.policyId().then(policyId => {
        return this._version.updateResource(
          URIs.RULE_CONDITION_EXCEPTION,
          [policyId, this._options['ruleId']],
          data
        );
      });
    } else {
      throw `The file does not exists: ${this._options['file']}`;
    }
  }
}

module.exports = {
  rules: Rules
};
