'use strict';

const untildify = require('untildify');
let fs = require('fs');
let URIs = require('./constants').URIS;
let Version = require('./versionsprovider').versionProvider;

class AccountProtectionAdvancedSettings {
  constructor(options) {
    this._options = options;
    this._version = new Version(options);
  }

  getTransactionalEndpointProtection() {
    return this._version.readResource(URIs.ACCOUNT_PROTECTION_ADVANCED_SETTINGS_TEP, []);
  }

  updateTransactionalEndpointProtection() {
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
    return this._version.updateResource(URIs.ACCOUNT_PROTECTION_ADVANCED_SETTINGS_TEP, [], data);
  }

  getUserAllowListId() {
    return this._version.readResource(URIs.ACCOUNT_PROTECTION_USER_ALLOW_LIST_ID, []);
  }

  updateUserAllowListId() {
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
    return this._version.updateResource(URIs.ACCOUNT_PROTECTION_USER_ALLOW_LIST_ID, [], data);
  }

  deleteUserAllowListId() {
    return this._version.deleteResource(URIs.ACCOUNT_PROTECTION_USER_ALLOW_LIST_ID, []);
  }
}

module.exports = {
  accountProtectionAdvancedSettings: AccountProtectionAdvancedSettings
};
