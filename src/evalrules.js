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

  getEvalRuleConditionException() {
    return this._policyProvider.policyId().then(policyId => {
      return this._version.readResource(URIs.EVAL_RULE_CONDITION_EXCEPTION, [
        policyId,
        this._options['ruleId']
      ]);
    });
  }

  updateEvalRuleConditionException() {
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
          URIs.EVAL_RULE_CONDITION_EXCEPTION,
          [policyId, this._options['ruleId']],
          data
        );
      });
    } else {
      throw `The file does not exists: ${this._options['file']}`;
    }
  }

  startEval() {
    return this._policyProvider.policyId().then(policyId => {
      let evalMode = JSON.parse(fs.readFileSync(__dirname + '/../templates/evalMode.json', 'utf8'));
      evalMode.eval = 'START';
      if(this._options['mode'])
        evalMode.mode=this._options['mode'];
      return this._version.createResource(URIs.EVAL_MODE, [policyId], evalMode);
    });
  }

  stopEval() {
    return this._policyProvider.policyId().then(policyId => {
      let evalMode = JSON.parse(fs.readFileSync(__dirname + '/../templates/evalMode.json', 'utf8'));
      evalMode.eval = 'STOP';
      return this._version.createResource(URIs.EVAL_MODE, [policyId], evalMode);
    });
  }

  restartEval() {
    return this._policyProvider.policyId().then(policyId => {
      let evalMode = JSON.parse(fs.readFileSync(__dirname + '/../templates/evalMode.json', 'utf8'));
      evalMode.eval = 'RESTART';
      return this._version.createResource(URIs.EVAL_MODE, [policyId], evalMode);
    });
  }

  updateEval() {
    return this._policyProvider.policyId().then(policyId => {
      let evalMode = JSON.parse(fs.readFileSync(__dirname + '/../templates/evalMode.json', 'utf8'));
      evalMode.eval = 'UPDATE';
      return this._version.createResource(URIs.EVAL_MODE, [policyId], evalMode);
    });
  }

  completeEval() {
    return this._policyProvider.policyId().then(policyId => {
      let evalMode = JSON.parse(fs.readFileSync(__dirname + '/../templates/evalMode.json', 'utf8'));
      evalMode.eval = 'COMPLETE';
      return this._version.createResource(URIs.EVAL_MODE, [policyId], evalMode);
    });
  }
}

module.exports = {
  evalrules: EvalRules
};
