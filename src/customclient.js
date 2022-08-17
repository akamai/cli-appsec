'use strict';

const untildify = require('untildify');
let fs = require('fs');
let URIs = require('./constants').URIS;
let Version = require('./versionsprovider').versionProvider;

class CustomClient {
  constructor(options) {
    this._options = options;
    this._version = new Version(options);
  }

  getCustomClientList() {
    return this._version.readResource(URIs.CUSTOM_CLIENTS, []);
  }

  addCustomClient() {
    if (fs.existsSync(untildify(this._options['file']))) {
      let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
      let data;
      try {
        data = JSON.parse(payload);
      } catch (err) {
        throw 'The input JSON is not valid';
      }
      return this._version.createResource(URIs.CUSTOM_CLIENTS, [], data);
    } else {
      throw `The file does not exists: ${this._options['file']}`;
    }
  }

  getCustomClient() {
    return this._version.readResource(URIs.CUSTOM_CLIENT, [this._options['custom_client_id']]);
  }

  updateCustomClient() {
    if (fs.existsSync(untildify(this._options['file']))) {
      let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
      let data;
      try {
        data = JSON.parse(payload);
      } catch (err) {
        throw 'The input JSON is not valid';
      }
      return this._version.updateResource(
        URIs.CUSTOM_CLIENT,
        [this._options['custom_client_id']],
        data
      );
    } else {
      throw `The file does not exists: ${this._options['file']}`;
    }
  }

  deleteCustomClient() {
    return this._version.deleteResource(URIs.CUSTOM_CLIENT, [this._options['custom_client_id']]);
  }
}

module.exports = {
  customclient: CustomClient
};
