'use strict';

let URIs = require('./constants').URIS;
let fs = require('fs');
let logger = require('./constants').logger('Activation');
let Edge =
  process.env.MOCK_AKA_SEC_API == 'true' ? require('../mock/edgeClient') : require('./edgeClient');
let Version = require('./versionsprovider').versionProvider;
let Config = require('./configprovider').configProvider;
class Activation {
  constructor(options) {
    this._edge = new Edge(options);
    this._version = new Version(options);
    this._config = new Config(options);
    this._options = options;
  }

  getStatus() {
    return this._edge.get(URIs.GET_ACTIVATION, [this._options['activation-id']]);
  }

  activate() {
    let activation = JSON.parse(
      fs.readFileSync(__dirname + '/../templates/activation.json', 'utf8')
    );
    activation.network = this._options.network;
    if (this._options.notes) {
      activation.note = this._options.notes;
    }
    if (this._options.notify) {
      activation.notificationEmails = this._options.notify;
    }

    return this._config
      .getConfigId()
      .then(configId => {
        activation.activationConfigs[0].configId = configId;
        return this._version.getVersionNumber();
      })
      .then(version => {
        activation.activationConfigs[0].configVersion = version;
        logger.debug('Activation payload: %s', JSON.stringify(activation));
        return this._edge.post(URIs.ACTIVATE_VERSION, activation, []);
      });
  }
}

module.exports = {
  activation: Activation
};
