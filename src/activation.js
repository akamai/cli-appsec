'use strict';

let URIs = require('./constants').URIS;
let logger = require('./constants').logger('Activation');
let Config = require('./configprovider').configProvider;

class Activation {
  constructor(options) {
    this._version = new Version(options);
    this._options = JSON.parse(JSON.stringify(options));
  }

  activate() {
  }

  getStatus() {
    return this._config.readResource(URIs.GET_ACTIVATION, [this._options['activation']]);
  }
}

module.exports = {
  activation: Activation
};
