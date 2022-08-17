'use strict';

const untildify = require('untildify');
let fs = require('fs');
let URIs = require('./constants').URIS;
let Version = require('./versionsprovider').versionProvider;

class CustomDenyAction {
  constructor(options) {
    this._options = options;
    this._version = new Version(options);
  }

  getCustomDenyActionList() {
    return this._version.readResource(URIs.CUSTOM_DENY_ACTIONS, []);
  }

  addCustomDenyAction() {
    if (fs.existsSync(untildify(this._options['file']))) {
      let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
      let data;
      try {
        data = JSON.parse(payload);
      } catch (err) {
        throw 'The input JSON is not valid';
      }
      return this._version.createResource(URIs.CUSTOM_DENY_ACTIONS, [], data);
    } else {
      throw `The file does not exists: ${this._options['file']}`;
    }
  }

  getCustomDenyAction() {
    return this._version.readResource(URIs.CUSTOM_DENY_ACTION, [this._options['action_id']]);
  }

  updateCustomDenyAction() {
    if (fs.existsSync(untildify(this._options['file']))) {
      let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
      let data;
      try {
        data = JSON.parse(payload);
      } catch (err) {
        throw 'The input JSON is not valid';
      }
      return this._version.updateResource(
        URIs.CUSTOM_DENY_ACTION,
        [this._options['action_id']],
        data
      );
    } else {
      throw `The file does not exists: ${this._options['file']}`;
    }
  }

  deleteCustomDenyAction() {
    return this._version.deleteResource(URIs.CUSTOM_DENY_ACTION, [this._options['action_id']]);
  }
}

module.exports = {
  customdenyaction: CustomDenyAction
};
