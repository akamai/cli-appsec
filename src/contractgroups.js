'use strict';
let Edge =
  process.env.MOCK_AKA_SEC_API == 'true' ? require('../mock/edgeClient') : require('./edgeClient');
let URIs = require('./constants').URIS;

class Contractgroups {
  constructor(options) {
    this._edge = new Edge(options);
    this._options = options;
  }

  getContractGroups() {
    return this._edge.get(URIs.GET_CONTRACT_GROUPS);
  }
}

module.exports = {
  contractgroups: Contractgroups
};
