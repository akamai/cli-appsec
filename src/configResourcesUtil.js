'use strict';

let logger = require('./constants').logger('ResourceUtil');
let URIs = require('./constants').URIS;

class ResourceUtil {
  constructor(edge) {
    this._edge = edge;
    this._config = new Config(this._edge);
  }

  readResource(confId, uri, params=[]) {
    logger.debug("uri 1==>"+uri);
    return this._config.getConfigId(confId).then(configId => {
      params.unshift(configId);
      logger.debug("uri 2==>"+uri);
      return this._edge.get(uri, params); //returns a promise
    });
  }

  putResource(confId, uri, payload, params=[]) {
    return this._config.getConfigId(confId).then(configId => {
      params.unshift(configId);
      return this._edge.put(uri, payload, params); //returns a promise
    });
  }

  postResource(confId, uri, payload, params=[]) {
    return this._config.getConfigId(confId).then(configId => {
      params.unshift(configId);
      return this._edge.post(uri, payload, params); //returns a promise
    });
  }
}

class Config {
  constructor(edge) {
    this._edge = edge;
  }
  /**
   * Resolves config Id. If the config id is null, the id is fetched from server. If there are more than one id, an error is thrown.
   * @param {number} configId The config id to work with.
   */
  getConfigId(configId) {
    if (!configId) {
      return this.getConfigs().then(configs => {
        if (configs.length == 1) {
          return configs[0].configId;
        } else {
          logger.error("You have more than one configuration. Please provide a configuration id to work with.");
          throw 'You have more than one configuration. Please provide a configuration id to work with.';
        }
      });
    } else {
      return Promise.resolve(configId);
    }
  }

  getConfigs() {
    return this._edge.get(URIs.GET_CONFIGS);
  }
}

module.exports = {
  config: Config,
  resourceUtil: ResourceUtil
};
