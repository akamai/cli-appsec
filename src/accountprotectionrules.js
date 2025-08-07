'use strict';

const untildify = require('untildify');
let fs = require('fs');
let URIs = require('./constants').URIS;
let Policy = require('./policy').policy;

class AccountProtectionRules {
  constructor(options) {
    this._options = options;
    this._policy = new Policy(options);
  }

  getAccountProtectionRules() {
    return this._policy.readResource(URIs.ACCOUNT_PROTECTION_RULES, []);
  }

  getAccountProtectionRuleById() {
    return this._policy.readResource(URIs.ACCOUNT_PROTECTION_RULE_BY_ID, [
      this._options['rule_id']
    ]);
  }

  addAccountProtectionRule() {
    if (!fs.existsSync(untildify(this._options['file']))) {
      throw `File ( ${this._options['file']} ) does not exists.`;
    }
    let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
    let data;
    try {
      data = JSON.parse(payload);
    } catch (err) {
      throw `Request payload from file ( ${this._options['file']} ) is not valid json.`;
    }
    return this._policy.createResource(URIs.ACCOUNT_PROTECTION_RULES, [], data);
  }

  modifyAccountProtectionRule() {
    if (!fs.existsSync(untildify(this._options['file']))) {
      throw `File ( ${this._options['file']} ) does not exists.`;
    }
    let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
    let data;
    try {
      data = JSON.parse(payload);
    } catch (err) {
      throw `Request payload from file ( ${this._options['file']} ) is not valid json.`;
    }
    return this._policy.updateResource(
      URIs.ACCOUNT_PROTECTION_RULE_BY_ID,
      [this._options['rule_id']],
      data
    );
  }

  deleteAccountProtectionRule() {
    return this._policy.deleteResource(URIs.ACCOUNT_PROTECTION_RULE_BY_ID, [
      this._options['rule_id']
    ]);
  }
}

module.exports = {
  accountProtectionRules: AccountProtectionRules
};
