'use strict';

let Edge =
  process.env.MOCK_AKA_SEC_API == 'true' ? require('../mock/edgeClient') : require('./edgeClient');

let URIs = require('./constants').URIS;
let logger = require('./constants').logger('ConfigProvider');

class ConfigProvider {
  constructor(options) {
    this._edge = new Edge(options);
    this._options = options;
    this._configId = options.config;
  }

  /**
   * Method to read resources tied directly to configuration.
   * @param {*} uri The URI of the resource.
   * @param {*} params parameters other than the configId
   */
  readResource(uri, params = []) {
    return this.getConfigId().then(configId => {
      params.unshift(configId);
      return this._edge.get(uri, params);
    });
  }

  /**
   * Method to update resources tied directly to configuration.
   * @param {*} uri The URI of the resource.
   * @param {*} params parameters other than the configId.
   */
  updateResource(uri, params = [], payload) {
    return this.getConfigId().then(configId => {
      params.unshift(configId);
      return this._edge.put(uri, payload, params);
    });
  }

  /**
   * Method to update resources tied directly to configuration.
   * @param {*} uri The URI of the resource.
   * @param {*} params parameters other than the configId.
   */
  createResource(uri, params = [], payload) {
    return this.getConfigId().then(configId => {
      params.unshift(configId);
      return this._edge.post(uri, payload, params);
    });
  }

  /**
   * Returns a promise that will provide all configurations.
   */
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
      return this.configs().then(configsObject => {
        if (configsObject && configsObject.configurations && configsObject.configurations.length) {
          this._configId = configsObject.configurations[0].id;
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
