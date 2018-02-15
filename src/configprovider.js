'use strict';

let Edge =
  process.env.MOCK_AKA_SEC_API == 'true' ? require('../mock/edgeClient') : require('./edgeClient');

let URIs = require('./constants').URIS;
let logger = require('./constants').logger('ConfigProvider');

class ConfigProvider {
  constructor(auth, options) {
    this._edge = new Edge(auth);
    this._options = options;
    this._configId = options.config;
  }

  configs() {
    logger.info('Fetching all available configurations..');
    return this._edge.get(URIs.GET_CONFIGS);
  }

  /**
   * Resolves config Id. If the config id is null, the id is fetched from server. If there are more than one id, an error is thrown.
   */
  getConfigId() {
    if (!this._configId) {
      logger.info('Config id not provided. Will attempt fetching the configuration.');
      return this.configs().then(configs => {
        if (configs.length == 1) {
          this._configId = configs[0].configId;
          logger.info('Config id chosen: ' + this._configId);
          return this._configId;
        } else {
          logger.error(
            'You have more than one configuration. Please provide a configuration id to work with.'
          );
          throw 'You have more than one configuration. Please provide a configuration id to work with.';
        }
      });
    } else {
      logger.info('Config id: ' + this._configId);
      return Promise.resolve(this._configId);
    }
  }
}

module.exports = {
  configProvider: ConfigProvider
};
