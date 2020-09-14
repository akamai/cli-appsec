'use strict';

let URIs = require('./constants').URIS;
//needed to pass files to PUT/POST
let fs = require('fs');
//Ensures user can add paths like '~/foo'
let untildify = require('untildify');
let Config = require('./configprovider').configProvider;
let Version = require('./versionsprovider').versionProvider;
let Edge =
  process.env.MOCK_AKA_SEC_API == 'true' ? require('../mock/edgeClient') : require('./edgeClient');

class SIEMSettings {
  constructor(options) {
    this._edge = new Edge(options);
    this._config = new Config(options);
    this._options = options;
    this._version = new Version(options);
  }

  getSIEMDefinitions() {
    return this._edge.get(URIs.SIEM_DEF_RESOURCE);
  }

  getSIEMSettings() {
    return this._version.readResource(URIs.SIEM_RESOURCE, []);
  }

  updateSIEMSettings() {
    if (fs.existsSync(this._options['file'])) {
      let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
      let data;
      try {
        data = JSON.parse(payload);
      } catch (err) {
        throw 'The input JSON is not valid';
      }
      return this._version.createResource(URIs.SIEM_RESOURCE, [], data);
    } else {
      throw `The file does not exists: ${this._options['file']}`;
    }
  }
}

module.exports = {
  siemSettings: SIEMSettings
};
