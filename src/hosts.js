'use strict';

let URIs = require('./constants').URIS;
let logger = require('./constants').logger('HostSelection');
let Version = require('./versionsprovider').versionProvider;

class SelectedHosts {
  constructor(options) {
    this._version = new Version(options);
    this._options = JSON.parse(JSON.stringify(options)); //clone
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
      for (let i = 0; i < this._options.hostnames.length; i++) {
        hosts.push({ hostName: this._options.hostnames[i] });
      }
      return this._version.updateResource(URIs.SELECTED_HOSTS_RESOURCE, [], selectedHosts);
    });
  }

  selectableHosts() {
    return this._version.readResource(URIs.SELECTABLE_HOSTS_RESOURCE, []);
  }

  selectedHosts() {
    return this._version.readResource(URIs.SELECTED_HOSTS_RESOURCE, []);
  }
}

module.exports = {
  selectedHosts: SelectedHosts
};
