'use strict';

const untildify = require('untildify');
let fs = require('fs');
let URIs = require('./constants').URIS;
let Policy = require('./policy').policy;

class AccountProtectionPolicySettings {
  constructor(options) {
    this._options = options;
    this._policy = new Policy(options);
  }

  getAccountProtectionSettings() {
    return this._policy.readResource(URIs.ACCOUNT_PROTECTION_SETTINGS, []);
  }

  updateAccountProtectionSettings() {
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
    return this._policy.updateResource(URIs.ACCOUNT_PROTECTION_SETTINGS, [], data);
  }
}

module.exports = {
  accountProtectionPolicySettings: AccountProtectionPolicySettings
};
