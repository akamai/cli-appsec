'use strict';

let Edge =
  process.env.MOCK_AKA_SEC_API == 'true' ? require('../mock/edgeClient') : require('./edgeClient');

let URIs = require('./constants').URIS;
let logger = require('./constants').logger('AppSecConfig');
let ConfigResourcesReader = require('./configResourcesUtil').resourceUtil;

class AppSecConfig {
  constructor(auth) {
    this._edge = new Edge(auth);
    this._configResourceReader = new ConfigResourcesReader(this._edge);
  }

  configs(options) {
    logger.debug('Options: ' + JSON.stringify(options));
    logger.info('Fetching all available configurations..');
    return this._edge.get(URIs.GET_CONFIGS);
  }

  versions(options) {
    logger.debug('Options: ' + JSON.stringify(options));
    logger.info('Fetching version list..');
    return this._configResourceReader.readResource(options.config, URIs.GET_VERSIONS, []);
  }
  /**
   * Returns the version asked for. If the version is not provided, the latest version is assumed.
   * @param {object} options the options passed in the command line
   */
  version(options) {
    logger.debug('Options: ' + JSON.stringify(options));
    let version = options.version;
    let versionAttr;
    logger.info('Fetching version: ' + version);

    //If version is not provided, select the latest version
    if (!version) {
      return this.versions(options).then(allVersions => {
        let maxVersion = 0;
        let resultVersion;
        for (let i = 0; allVersions && i < allVersions.versionList.length; i++) {
          if (allVersions.versionList[i].version > maxVersion) {
            resultVersion = allVersions.versionList[i];
            maxVersion = allVersions.versionList[i].version;
          }
        }
        return resultVersion;
      });
    } else {
      if (version == 'PROD' || version == 'PRODUCTION') {
        versionAttr = 'production';
      } else if (version == 'STAGING') {
        versionAttr = 'staging';
      }
      if (versionAttr) {
        return this.versions(options).then(allVersions => {
          for (let i = 0; allVersions && i < allVersions.versionList.length; i++) {
            if (allVersions.versionList[i][versionAttr].status == 'Active') {
              return allVersions.versionList[i];
            }
          }
        });
      } else {
        return this._configResourceReader.readResource(options.config, URIs.GET_VERSION, [version]);
      }
    }
  }
}

module.exports = {
  AppSecConfig: AppSecConfig
};
