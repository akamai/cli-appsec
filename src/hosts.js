'use strict';

let URIs = require('./constants').URIS;
let logger = require('./constants').logger('HostSelection');
let Version = require('./versionsprovider').versionProvider;

class SelectedHosts {
  constructor(auth, options) {
    this._version = new Version(auth, options);
    this._options = options;
  }

  addHosts() {
    logger.debug('Adding hosts to selected list.');
    return this._version.readResource(URIs.SELECTED_HOSTS_RESOURCE, []).then(selectedHosts => {
      let hosts = [];
      if (!selectedHosts || !selectedHosts.hostnameList) {
        selectedHosts = { hostnameList: [] };
      }
      logger.info('Adding hosts to the list: ' + JSON.stringify(selectedHosts.hostnameList));
      hosts = selectedHosts.hostnameList;
      for (let i = 0; i < this._options.hosts.length; i++) {
        hosts.push({ hostName: this._options.hosts[i] });
      }
      return this._version.updateResource(
        URIs.SELECTED_HOSTS_RESOURCE,
        [],
        JSON.stringify(selectedHosts)
      );
    });
  }

  selectableHosts() {
    return this._version.readResource(URIs.SELECTABLE_HOSTS_RESOURCE, []);
  }
}

module.exports = {
  selectedHosts: SelectedHosts
};
