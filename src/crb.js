'use strict';
let Edge =
  process.env.MOCK_AKA_SEC_API == 'true' ? require('../mock/edgeClient') : require('./edgeClient');

let URIs = require('./constants').URIS;
let fs = require('fs');
const CRB_TEMPLATE_PATH = __dirname + '/../templates/crbTemplate.json';
let ConfigProvider = require('./configprovider').configProvider;

class CRBHandler {
  constructor(auth, options) {
    this._edge = new Edge(auth);
    this._configProvider = new ConfigProvider(auth, options);
    this._options = options;
  }

  template() {
    return fs.readFileSync(CRB_TEMPLATE_PATH, 'utf8');
  }

  getAllRules() {
    return this._configProvider.getConfigId().then(configId => {
      return this._edge.get(URIs.GET_CRB_ALL, [configId]);
    });
  }

  getRule() {
    return this._configProvider.getConfigId().then(configId => {
      return this._edge.get(URIs.GET_CRB, [configId, this._options['custom-rule']]);
    });
  }

  createRule() {
    return this._configProvider.getConfigId().then(configId => {
      return this._edge.post(URIs.GET_CRB_ALL, [configId]);
    });
  }

  updateRule() {
    return this._configProvider.getConfigId().then(configId => {
      return this._edge.put(URIs.GET_CRB, [configId, this._options['custom-rule']]);
    });
  }
}
module.exports = {
  CRBHandler: CRBHandler
};
