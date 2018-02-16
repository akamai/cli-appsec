'use strict';

let URIs = require('./constants').URIS;
let fs = require('fs');
const CRB_TEMPLATE_PATH = __dirname + '/../templates/crbTemplate.json';
let Config = require('./configprovider').configProvider;

class CRBHandler {
  constructor(auth, options) {
    this._config = new Config(auth, options);
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
    return this._config.createResource(URIs.GET_CRB_ALL, [this._options['custom-rule']], undefined);
  }

  updateRule() {
    return this._config.updateResource(URIs.GET_CRB, [this._options['custom-rule']], undefined);
  }
}
module.exports = {
  CRBHandler: CRBHandler
};
