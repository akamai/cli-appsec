'use strict';

let URIs = require('./constants').URIS;
let Config = require('./configprovider').configProvider;

class ActivationHistory {
  constructor(options) {
    this._config = new Config(options);
    this._options = options;
  }

  getActivationHistory() {
    return this._config.readResource(URIs.ACTIVATION_HISTORY, []);
  }
}

module.exports = {
  activationHistory: ActivationHistory
};
