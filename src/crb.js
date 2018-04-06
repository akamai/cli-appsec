'use strict';

let URIs = require('./constants').URIS;
//needed to pass files to PUT/POST
let fs = require('fs');
//Ensures user can add paths like '~/foo'
let untildify = require('untildify');
const CRB_TEMPLATE_PATH = __dirname + '/../templates/crbTemplate.json';
let Config = require('./configprovider').configProvider;
let Version = require('./versionsprovider').versionProvider;
let PolicyProvider = require('./policy').policy;
class CRBHandler {
  constructor(options) {
    this._config = new Config(options);
    this._options = options;
    this._version = new Version(options);
    this._policyProvider = new PolicyProvider(options);
  }

  template() {
    return fs.readFileSync(CRB_TEMPLATE_PATH, 'utf8');
  }

  getAllRules() {
    return this._config.readResource(URIs.GET_CRB_ALL, []);
  }

  getRule() {
    return this._config.readResource(URIs.GET_CRB, [this._options['custom-rule']]);
  }

  deleteRule() {
    return this._config.deleteResource(URIs.GET_CRB, [this._options['custom-rule']]);
  }

  createRule() {
    let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
    return this._config.createResource(URIs.GET_CRB_ALL, [], JSON.parse(payload));
  }

  updateRule() {
    let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
    return this._config.updateResource(
      URIs.GET_CRB,
      [this._options['custom-rule']],
      JSON.parse(payload)
    );
  }

  assign() {
    return this._policyProvider.policyId().then(policyId => {
      //let policyId = this._options['policy'];
      let ruleId = this._options['custom-rule'];
      let action = this._options['action'];
      let payload = { action: action };
      return this._version.updateResource(URIs.CRB_ACTION, [policyId, ruleId], payload);
    });
  }
}

module.exports = {
  CRBHandler: CRBHandler
};
