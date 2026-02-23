'use strict';

const untildify = require('untildify');
let fs = require('fs');
let URIs = require('./constants').URIS;
let Policy = require('./policy').policy;

class AccountProtectionRuleSequence {
  constructor(options) {
    this._options = options;
    this._policy = new Policy(options);
  }

  getAccountProtectionRuleSequence() {
    return this._policy.readResource(URIs.ACCOUNT_PROTECTION_RULE_SEQUENCE, []);
  }

  modifyAccountProtectionRuleSequence() {
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
    return this._policy.updateResource(URIs.ACCOUNT_PROTECTION_RULE_SEQUENCE, [], data);
  }
}

module.exports = {
  accountProtectionRuleSequence: AccountProtectionRuleSequence
};
