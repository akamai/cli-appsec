'use strict';

let URIs = require('./constants').URIS;
let fs = require('fs');
let untildify = require('untildify');
let Config = require('./configprovider').configProvider;
let Version = require('./versionsprovider').versionProvider;

class CustomDeny {
  constructor(options) {
    this._config = new Config(options);
    this._options = options;
    this._version = new Version(options);
  }

  getCustomdenyList() {
    let listUrl = URIs.CUSTOM_DENY;
    if (this._options['search']) {
      listUrl = listUrl + '?search=' + this._options['search'];
    }
    return this._version.readResource(listUrl, []);
  }

  getCustomdeny() {
    return this._version.readResource(URIs.CUSTOM_DENY_BY_ID, [this._options['custom_deny_id']]);
  }

  addCustomdeny() {
    if (fs.existsSync(this._options['file'])) {
      let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
      let data;
      try {
        data = JSON.parse(payload);
      } catch (err) {
        throw 'The input JSON is not valid';
      }
      return this._version.createResource(URIs.CUSTOM_DENY, [], data);
    } else {
      throw `The file does not exists: ${this._options['file']}`;
    }
  }

  updateCustomdeny() {
    if (fs.existsSync(this._options['file'])) {
      let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
      let data;
      try {
        data = JSON.parse(payload);
      } catch (err) {
        throw 'The input JSON is not valid';
      }
      return this._version.updateResource(
        URIs.CUSTOM_DENY_BY_ID,
        [this._options['custom_deny_id']],
        data
      );
    } else {
      throw `The file does not exists: ${this._options['file']}`;
    }
  }

  deleteCustomdeny() {
    return this._version.deleteResource(URIs.CUSTOM_DENY_BY_ID, [this._options['custom_deny_id']]);
  }
}

module.exports = {
  customdeny: CustomDeny
};
