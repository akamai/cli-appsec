'use strict';

let URIs = require('./constants').URIS;
//needed to pass files to PUT/POST
let fs = require('fs');
//Ensures user can add paths like '~/foo'
let untildify = require('untildify');
const CRB_TEMPLATE_PATH = __dirname + '/../templates/crbTemplate.json';
let Config = require('./configprovider').configProvider;

class CRBHandler {
  constructor(options) {
    this._config = new Config(options);
    this._options = options;
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

  createRule() {
    let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
    return this._config.createResource(URIs.GET_CRB_ALL, [this._options['custom-rule']], payload);
  }

  updateRule() {
    let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
    return this._config.updateResource(URIs.GET_CRB, [this._options['custom-rule']], payload);
  }

  assign() {
    let version = this._options['version'];
    let policyId = this._options['policy'];
    let ruleId = this._options['custom-rule'];
    let action = this._options['action'];
    let payload = { action: action };
    return this._config.updateResource(URIs.CRB_ACTION, [version, policyId, ruleId], payload);
  }
}

module.exports = {
  CRBHandler: CRBHandler
};
