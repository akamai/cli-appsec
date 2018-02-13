'use strict';
let Edge =
  process.env.MOCK_AKA_SEC_API == 'true' ? require('../mock/edgeClient') : require('./edgeClient');

let URIs = require('./constants').URIS;
let logger = require('./constants').logger('CRBHandler');
let ConfigResourcesReader = require('./configResourcesUtil').resourceUtil;
let Config = require('./appSecConfig').AppSecConfig;

require('string-format');
var fs = require('fs');
const CRB_TEMPLATE_PATH = __dirname + '/../templates/crbTemplate.json';
const ENCODING = 'utf8';
class CRBHandler {
  constructor(auth) {
    this._edge = new Edge(auth);
    this._configResourceReader = new ConfigResourcesReader(this._edge);
    this._config = new Config();
  }

  template() {
    return fs.readFileSync(CRB_TEMPLATE_PATH, ENCODING);
  }

  getAllRules(options) {
    logger.debug('======>>> 1 ');
    return this._config.config(options).then(configObj => {
      logger.debug('======>>> 2 ' + JSON.stringify(configObj));
      options.config = configObj.configId;
      return this._configResourceReader.readResource(options.config, URIs.GET_CRB_ALL, []);
    });
  }

  getRule(options) {
    return this._configResourceReader.readResource(options.config, URIs.GET_CRB, [options.ruleId]);
  }
  createRule(options) {
    return this._configResourceReader.postResource(
      options.config,
      URIs.GET_CRB_ALL,
      options.file,
      []
    );
  }
  updateRule(options) {
    return this._configResourceReader.putResource(options.config, URIs.GET_CRB, options.file, [
      options.ruleId
    ]);
  }
}
module.exports = {
  CRBHandler: CRBHandler
};
