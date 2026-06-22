'use strict';

let URIs = require('./constants').URIS;
let fs = require('fs');
let untildify = require('untildify');
let Version = require('./versionsprovider').versionProvider;
let PolicyProvider = require('./policy').policy;

class AiRules {
  constructor(options) {
    this._options = options;
    this._version = new Version(options);
    this._policyProvider = new PolicyProvider(options);
  }

  getAiRules() {
    return this._policyProvider.policyId().then(policyId => {
      return this._version.readResource(URIs.AI_RULES, [policyId]);
    });
  }

  getAiRulesStatus() {
    return this._policyProvider.policyId().then(policyId => {
      return this._version.readResource(URIs.AI_RULES_STATUS, [policyId]);
    });
  }

  updateAiRulesStatus() {
    if (fs.existsSync(untildify(this._options['file']))) {
      let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
      let data;
      try {
        data = JSON.parse(payload);
      } catch (err) {
        throw 'The input JSON is not valid';
      }
      return this._policyProvider.policyId().then(policyId => {
        return this._version.updateResource(URIs.AI_RULES_STATUS, [policyId], data);
      });
    } else {
      throw `The file does not exist: ${this._options['file']}`;
    }
  }

  getAiRuleAction() {
    return this._policyProvider.policyId().then(policyId => {
      return this._version.readResource(URIs.AI_RULE_ACTION, [
        policyId,
        this._options['rule-id'],
        this._options['rule-version-id']
      ]);
    });
  }

  updateAiRuleAction() {
    if (fs.existsSync(untildify(this._options['file']))) {
      let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
      let data;
      try {
        data = JSON.parse(payload);
      } catch (err) {
        throw 'The input JSON is not valid';
      }
      return this._policyProvider.policyId().then(policyId => {
        return this._version.updateResource(
          URIs.AI_RULE_ACTION,
          [policyId, this._options['rule-id'], this._options['rule-version-id']],
          data
        );
      });
    } else {
      throw `The file does not exist: ${this._options['file']}`;
    }
  }
}

module.exports = { airules: AiRules };
