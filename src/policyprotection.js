'use strict';

let URIs = require('./constants').URIS;
//needed to pass files to PUT/POST
let fs = require('fs');
//Ensures user can add paths like '~/foo'
let untildify = require('untildify');
let Config = require('./configprovider').configProvider;
let Version = require('./versionsprovider').versionProvider;
let PolicyProvider = require('./policy').policy;
class PolicyProtections {
  constructor(options) {
    this._config = new Config(options);
    this._options = options;
    this._version = new Version(options);
    this._policyProvider = new PolicyProvider(options);
  }

  getProtections() {
    return this._policyProvider.policyId().then(policyId => {
      return this._version.readResource(URIs.POLICY_PROTECTIONS, [policyId]);
    });
  }

  setProtections() {
    if (fs.existsSync(this._options['file'])) {
      return this._policyProvider.policyId().then(policyId => {
        let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
        let data;
        try {
          data = JSON.parse(payload);
        } catch (err) {
          throw 'The input JSON is not valid';
        }
        return this._version.updateResource(URIs.POLICY_PROTECTIONS, [policyId], data);
      });
    } else {
      throw `The file does not exists: ${this._options['file']}`;
    }
  }
}

module.exports = {
  policyProtection: PolicyProtections
};
