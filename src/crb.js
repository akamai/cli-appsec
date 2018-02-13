'use strict';
let Edge =
  process.env.MOCK_AKA_SEC_API == 'true' ? require('../mock/edgeClient') : require('./edgeClient');

let URIs = require('./constants').URIS;
//let logger = require('./constants').logger('CRBHandler');
let ConfigResourcesReader = require('./configResourcesUtil').resourceUtil;

require('string-format');
let fs = require('fs');
const CRB_TEMPLATE_PATH = __dirname + '/../templates/crbTemplate.json';

class CRBHandler {
  constructor(auth) {
    this._client = new ConfigResourcesReader(new Edge(auth));
  }

  template() {
    return fs.readFileSync(CRB_TEMPLATE_PATH, 'utf8');
  }

  getAllRules(options) {
    return this._client.readResource(options.config, URIs.GET_CRB_ALL, []);
  }

  getRule(options) {
    return this._client.readResource(options.config, URIs.GET_CRB, [options.ruleId]);
  }

  createRule(options) {
    return this._client.postResource(options.config, URIs.GET_CRB_ALL, options.file, []);
  }

  updateRule(options) {
    return this._client.putResource(options.config, URIs.GET_CRB, options.file, [options.ruleId]);
  }
}
module.exports = {
  CRBHandler: CRBHandler
};
