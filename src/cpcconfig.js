'use strict';

const untildify = require('untildify');
let fs = require('fs');
let URIs = require('./constants').URIS;
let Version = require('./versionsprovider').versionProvider;
let PolicyProvider = require('./policy').policy;

class CpcConfig {
  constructor(options) {
    this._options = options;
    this._version = new Version(options);
    this._policyProvider = new PolicyProvider(options);
  }

  getCpcConfig() {
    return this._policyProvider.policyId().then(policyId => {
      return this._version.readResource(URIs.CPC_CONFIG, [policyId]);
    });
  }

  updateCpcConfig() {
    if (fs.existsSync(untildify(this._options['file']))) {
      let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
      let data;
      try {
        data = JSON.parse(payload);
      } catch (err) {
        throw 'The input JSON is not valid';
      }
      return this._policyProvider.policyId().then(policyId => {
        return this._version.updateResource(URIs.CPC_CONFIG, [policyId], data);
      });
    } else {
      throw `The file does not exist: ${this._options['file']}`;
    }
  }

  enableCpc() {
    return this._policyProvider.policyId().then(policyId => {
      let protection = JSON.parse(
        fs.readFileSync(__dirname + '/../templates/cpc-protection.json', 'utf8')
      );
      protection.applyClientSideProtectionControls = true;
      return this._version.updateResource(URIs.POLICY_PROTECTIONS, [policyId], protection);
    });
  }

  disableCpc() {
    return this._policyProvider.policyId().then(policyId => {
      let protection = JSON.parse(
        fs.readFileSync(__dirname + '/../templates/cpc-protection.json', 'utf8')
      );
      protection.applyClientSideProtectionControls = false;
      return this._version.updateResource(URIs.POLICY_PROTECTIONS, [policyId], protection);
    });
  }
}

module.exports = { cpcconfig: CpcConfig };
