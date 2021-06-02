'use strict';

let URIs = require('./constants').URIS;
let fs = require('fs');
let untildify = require('untildify');
let Config = require('./configprovider').configProvider;
let Version = require('./versionsprovider').versionProvider;
let PolicyProvider = require('./policy').policy;

class BypassNL {
  constructor(options) {
    this._config = new Config(options);
    this._options = options;
    this._version = new Version(options);
    this._policy = new PolicyProvider(options);
  }

  getBypassNetworkList() {
    let listUrl = URIs.BYPASS_NETWORK_LIST;

    return this._policy.readResource(listUrl, []);
  }

  updateBypassNetworkList() {
    if (fs.existsSync(this._options['file'])) {
      let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
      let data;
      try {
        data = JSON.parse(payload);
      } catch (err) {
        throw 'The input JSON is not valid';
      }
      return this._policy.updateResource(URIs.BYPASS_NETWORK_LIST, [], data);
    } else {
      throw `The file does not exists: ${this._options['file']}`;
    }
  }
}

module.exports = {
  bypassnetworklist: BypassNL
};
