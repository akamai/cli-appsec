'use strict';

let URIs = require('./constants').URIS;
let fs = require('fs');
let untildify = require('untildify');
let Config = require('./configprovider').configProvider;
let Version = require('./versionsprovider').versionProvider;
let PolicyProvider = require('./policy').policy;

class WafRuleset {
  constructor(options) {
    this._config = new Config(options);
    this._options = options;
    this._version = new Version(options);
    this._policyProvider = new PolicyProvider(options);
  }

  getWafRuleset() {
    return this._policyProvider.policyId().then(policyId => {
      return this._version.readResource(URIs.WAF_RULESET, [policyId]);
    });
  }

  modifyWafRuleset() {
    if (fs.existsSync(this._options['file'])) {
      let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
      let data;
      try {
        data = JSON.parse(payload);
      } catch (err) {
        throw 'The input JSON is not valid';
      }
      return this._policyProvider.policyId().then(policyId => {
        return this._version.patchResource(URIs.WAF_RULESET, [policyId], data);
      });
    } else {
      throw `The file does not exist: ${this._options['file']}`;
    }
  }
}

module.exports = {
  wafRuleset: WafRuleset
};
