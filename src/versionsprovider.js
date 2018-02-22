'use strict';

let Edge =
  process.env.MOCK_AKA_SEC_API == 'true' ? require('../mock/edgeClient') : require('./edgeClient');

let URIs = require('./constants').URIS;
let logger = require('./constants').logger('VersionProvider');
let ConfigProvider = require('./configprovider').configProvider;

class VersionProvider {
  constructor(options) {
    this._edge = new Edge(options);
    this._config = new ConfigProvider(options);
    this._options = JSON.parse(JSON.stringify(options)); //clone
    this._version = options.version;
  }

  /**
   * Reads resources tied to config version.
   * @param {*} uri The uri of the resource. Always starts with /configs/<id>/versions/<id>/
   * @param {*} params the parameters that gets substituted in the uri in order(except config id and version id)
   */
  readResource(uri, params) {
    let args = [];
    return this.getConfigId()
      .then(configId => {
        args.push(configId);
        return this.getVersionNumber();
      })
      .then(version => {
        args.push(version);
        return this._edge.get(uri, args.concat(params));
      });
  }

  /**
   * Updates resources tied to config version.
   * @param {*} uri The uri of the resource. Always starts with /configs/<id>/versions/<id>/
   * @param {*} params the parameters that gets substituted in the uri in order(except config id and version id)
   */
  updateResource(uri, params, payload) {
    let args = [];
    return this.getConfigId()
      .then(configId => {
        args.push(configId);
        return this.getVersionNumber();
      })
      .then(version => {
        args.push(version);
        return this._edge.put(uri, payload, args.concat(params));
      });
  }

  /**
   * Creates resources tied to config version.
   * @param {*} uri The uri of the resource. Always starts with /configs/<id>/versions/<id>/
   * @param {*} params the parameters that gets substituted in the uri in order(except config id and version id)
   */
  createResource(uri, params, payload) {
    let args = [];
    return this.getConfigId()
      .then(configId => {
        args.push(configId);
        return this.getVersionNumber();
      })
      .then(version => {
        args.push(version);
        return this._edge.post(uri, payload, args.concat(params));
      });
  }

  getConfigId() {
    return this._config.getConfigId();
  }
  /**
   * Returns all the versions.
   */
  versions() {
    logger.info('Fetching version list....ll');
    //&page=1&pageSize=%s
    let uri = URIs.GET_VERSIONS;
    let params = [];
    if (this._options.limit && !isNaN(this._options.limit)) {
      uri = uri + '&page=1&pageSize=%s';
      params.push(this._options.limit);
    }
    return this._config.readResource(uri, params);
  }

  /**
   * Returns the version number. If the version is not provided, the latest version is assumed.
   */
  getVersionNumber() {
    if (!isNaN(this._version)) {
      logger.info('Version number:' + this._version);
      return Promise.resolve(this._version);
    } else {
      logger.debug(
        'Version number is not provided. Will attempt to fetch the latest from the server.'
      );
      return this.version().then(versionObj => {
        this._version = versionObj.version;
        return Promise.resolve(this._version);
      });
    }
  }

  /**
   * Returns the version asked for. If the version is not provided, the latest version is assumed.
   */
  version() {
    //If version is not provided, select the latest version
    if (!this._version) {
      logger.info(
        'Version number is not provided. Will attempt to fetch the latest from the server.'
      );
      return this.versions().then(allVersions => {
        let maxVersion = 0;
        let resultVersion;
        for (let i = 0; allVersions && i < allVersions.versionList.length; i++) {
          if (allVersions.versionList[i].version > maxVersion) {
            resultVersion = allVersions.versionList[i];
            maxVersion = allVersions.versionList[i].version;
          }
        }
        this._version = maxVersion;
        logger.info('Choosing version:' + this._version);
        return resultVersion;
      });
    } else {
      let versionAttr =
        this._version == 'PROD' || this._version == 'PRODUCTION'
          ? 'production'
          : this._version == 'STAGING' ? 'staging' : undefined;
      if (versionAttr) {
        return this.versions().then(allVersions => {
          for (let i = 0; allVersions && i < allVersions.versionList.length; i++) {
            if (allVersions.versionList[i][versionAttr].status == 'Active') {
              this._version = allVersions.versionList[i].version;
              logger.info('Choosing version:' + this._version);
              return allVersions.versionList[i];
            }
          }
        });
      } else {
        logger.info('Fetching version:' + this._version);
        return this.getConfigId().then(configId => {
          return this._edge.get(URIs.GET_VERSION, [configId, this._version]);
        });
      }
    }
  }
}

module.exports = {
  versionProvider: VersionProvider
};
