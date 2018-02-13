'use strict';
let Edge =
  process.env.MOCK_AKA_SEC_API == 'true' ? require('../mock/edgeClient') : require('./edgeClient');

let URIs = require('./constants').URIS;
let logger = require('./constants').logger('CRBHandler');
let ConfigResourcesReader = require('./configResourcesUtil').resourceUtil;

require('string-format');
var fs = require('fs');
const CRB_TEMPLATE_PATH = __dirname + '/../templates/crbTemplate.json';
const ENCODING = 'utf8';
class CRBHandler {
  constructor(auth) {
    this._edge = new Edge(auth);
    this._configResourceReader = new ConfigResourcesReader(this._edge);
  }

  template() {
    return new Promise(resolve => {
      resolve(fs.readFileSync(CRB_TEMPLATE_PATH, ENCODING));
    });
  }

  getAllRules(options) {
    return this._configResourceReader.readResource(options.config, URIs.GET_CRB_ALL, []);
  }
  getRule(options) {
    return this._configResourceReader.readResource(options.config, URIs.GET_CRB, [options.ruleId]);
  }
  createRule(options) {
    return this._configResourceReader.post(options.config, URIs.GET_CRB_ALL, [], options.file);
  }
  updateRule(options) {
    return this._configResourceReader.put(
      options.config,
      URIs.GET_CRB,
      [options.ruleId],
      options.file
    );
  }
}
module.exports = {
  CRBHandler: CRBHandler
};
