'use strict';

let Edge =
  process.env.MOCK_AKA_SEC_API == 'true' ? require('../mock/edgeClient') : require('./edgeClient');

let URIs = require('./constants').URIS;
let logger = require('./constants').logger('HostSelection');
let ConfigResource = require('./configResourcesUtil').resourceUtil;
let Config = require('./appSecConfig').AppSecConfig;

class SelectedHosts {
  constructor(auth) {
    this._edge = new Edge(auth);
    this._configResource = new ConfigResource(this._edge);
    this._config = new Config();
  }

  addHosts(options) {
    logger.debug('Adding hosts to selected list.');
    return this._config
      .version(options)
      .then(version => {
        options.version = version.version;
        options.config = version.configId;
        return this._configResource.readResource(options.config, URIs.SELECTED_HOSTS_RESOURCE, [
          version.version
        ]);
      })
      .then(selectedHosts => {
        let hosts = [];
        if (!selectedHosts || !selectedHosts.hostnameList) {
          selectedHosts = { hostnameList: [] };
        }
        logger.info('Adding hosts to the list: ' + JSON.stringify(selectedHosts.hostnameList));
        hosts = selectedHosts.hostnameList;
        for (let i = 0; i < options.hosts.length; i++) {
          hosts.push({ hostName: options.hosts[i] });
        }
        return this._edge.put(URIs.SELECTED_HOSTS_RESOURCE, JSON.stringify(selectedHosts), [
          options.config,
          options.version
        ]);
      });
  }

  selectableHosts(options) {
    return this._config.version(options).then(version => {
      options.version = version.version;
      options.config = version.configId;
      return this._configResource.readResource(options.config, URIs.SELECTABLE_HOSTS_RESOURCE, [
        version.version
      ]);
    });
  }
}

module.exports = {
  selectedHosts: SelectedHosts
};
