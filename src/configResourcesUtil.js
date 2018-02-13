'use strict';

let logger = require('./constants').logger('ResourceUtil');
let util = require('util');
let URIs = require('./constants').URIS;
const untildify = require('untildify');
var fs = require('fs');
class ResourceUtil {
  constructor(edge) {
    this._edge = edge;
    this._config = new Config(this._edge);
  }

  readResource(confId, uri, params) {
    return this._config.getConfigId(confId).then(configId => {
      let uriWithConfigId = util.format(uri, configId);
      for (let i = 0; params && i < params.length; i++) {
        uriWithConfigId = util.format(uriWithConfigId, params[i]);
      }
      logger.debug('URI: ' + uriWithConfigId);
      return this._edge.get(uriWithConfigId); //returns a promise
    });
  }
  post(confId, uri, params, body) {
    return this._config.getConfigId(confId).then(configId => {
      let postBodyString = fs.readFileSync(untildify(body));
      let uriWithConfigId = util.format(uri, configId);
      for (let i = 0; params && i < params.length; i++) {
        uriWithConfigId = util.format(uriWithConfigId, params[i]);
      }
      return this._edge.post(uriWithConfigId, postBodyString); //returns a promise
    });
  }
  put(confId, uri, params, body) {
    return this._config.getConfigId(confId).then(configId => {
      let putBodyString = fs.readFileSync(untildify(body));
      let uriWithConfigId = util.format(uri, configId);
      for (let i = 0; params && i < params.length; i++) {
        uriWithConfigId = util.format(uriWithConfigId, params[i]);
      }
      return this._edge.put(uriWithConfigId, putBodyString); //returns a promise
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
