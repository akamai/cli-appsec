'use strict';

let URIs = require('./constants').URIS;
let fs = require('fs');
let logger = require('./constants').logger('Activation');
let Config = require('./configprovider').configProvider;
let Version = require('./versionsprovider').versionProvider;
const TEMPLATE_PATH = __dirname + '/../templates/activation.json';


class Activation {
  constructor(options) {
    this._config = new Config(options);
    this._version = new Version(options);
    this._options = options;
    this._activation = JSON.parse(fs.readFileSync(TEMPLATE_PATH, 'utf8'));
  }

  getStatus() {
    return this._config.readResource(URIs.GET_ACTIVATION, [this._options['activation-id']]);
  }

  activate() {
      this._activation.network = this._options.network;
      return this._version.createResource(URIs.ACTIVATE_VERSION, [], this._activation);
  }
}

module.exports = {
  activation: Activation
};
