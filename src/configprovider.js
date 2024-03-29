'use strict';

let Edge =
  process.env.MOCK_AKA_SEC_API == 'true' ? require('../mock/edgeClient') : require('./edgeClient');

let URIs = require('./constants').URIS;
let logger = require('./constants').logger('ConfigProvider');
let fs = require('fs');
let untildify = require('untildify');

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
   * Method to delete resources tied directly to configuration.
   * @param {*} uri The URI of the resource.
   * @param {*} params parameters other than the configId
   */
  deleteResource(uri, params = []) {
    return this.getConfigId().then(configId => {
      params.unshift(configId);
      return this._edge.delete(uri, params);
    });
  }

  deleteConfig() {
    return this.deleteResource(URIs.GET_CONFIG, []);
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
    this.includeHostnames = this._options['include-hostnames'] || false;
    this.includeContractGroup = this._options['include-contract-group'] || false;
    return this._edge.get(URIs.GET_CONFIGS, [this.includeHostnames, this.includeContractGroup]);
  }

  /**
   * Returns a target product for the config ID
   */
  getTargetProduct() {
    return this.getConfigId().then(() => {
      return this._edge.get(URIs.GET_CONFIGS, [false, false]).then(configs => {
        const config = configs.configurations.find(cfg => cfg.id === this._configId);
        if (config) {
          return config.targetProduct;
        } else {
          logger.error('No security configurations exist for this config ID - ' + this._configId);
          throw `No security configurations exist for this config ID - ${this._configId}`;
        }
      });
    });
  }

  /**
   * Create Config.
   */
  createConfig() {
    if (fs.existsSync(this._options['file'])) {
      let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
      let data;
      try {
        data = JSON.parse(payload);
      } catch (err) {
        throw 'The input JSON is not valid';
      }
      return this._edge.post(URIs.GET_CONFIGS, data, []);
    } else {
      throw `The file does not exists: ${this._options['file']}`;
    }
  }

  /**
   * Resolves config Id. If the config id is null, the id is fetched from server. If there are more than one id, an error is thrown.
   */
  getConfigId() {
    if (!this._configId) {
      logger.info('Config id not provided. Will attempt fetching the configuration.');
      return this.configs().then(configsObject => {
        if (configsObject && configsObject.configurations && configsObject.configurations.length) {
          if (configsObject.configurations.length > 1) {
            logger.error(
              'You have more than one configuration. Please provide a configuration id to work with.'
            );
            throw 'You have more than one configuration. Please provide a configuration id to work with.';
          } else {
            this._configId = configsObject.configurations[0].id;
            logger.info('Config id chosen: ' + this._configId);
            return this._configId;
          }
        } else {
          logger.error('No security configurations exist.');
          throw 'No security configurations exist.';
        }
      });
    } else {
      logger.info('Config id: ' + this._configId);
      return Promise.resolve(this._configId);
    }
  }

  cloneConfig() {
    if (fs.existsSync(this._options['file'])) {
      let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
      let data;
      try {
        data = JSON.parse(payload);
      } catch (err) {
        throw 'The input JSON is not valid';
      }
      if (data.createFrom) {
        return this._edge.post(URIs.GET_CONFIGS, data, []);
      } else {
        throw 'The createFrom is not specified in the input JSON.';
      }
    } else {
      throw `The file does not exists: ${this._options['file']}`;
    }
  }

  renameConfig() {
    let rename = JSON.parse(
      fs.readFileSync(__dirname + '/../templates/rename-config.json', 'utf8')
    );
    rename.name = this._options['name'];
    rename.description = this._options['description'];
    return this.updateResource(URIs.GET_CONFIG, [], rename);
  }
}

module.exports = {
  configProvider: ConfigProvider
};
