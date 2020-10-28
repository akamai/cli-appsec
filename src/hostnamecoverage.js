'use strict';

let URIs = require('./constants').URIS;
let Config = require('./configprovider').configProvider;
let Version = require('./versionsprovider').versionProvider;
let Edge =
  process.env.MOCK_AKA_SEC_API == 'true' ? require('../mock/edgeClient') : require('./edgeClient');

class HostnameCoverage {
  constructor(options) {
    this._edge = new Edge(options);
    this._config = new Config(options);
    this._options = options;
    this._version = new Version(options);
  }

  getHostnameCoverage() {
    if (this._options['match-target'] && this._options['overlapping']) {
      throw 'Cannot retrieve both the hostname coverage match targets and overlapping list at the same time.';
    } else if (this._options['match-target'] || this._options['overlapping']) {
      if (!this._options['host']) {
        throw 'Host is required when retrieving hostname coverage match target or overlapping list.';
      }
      return this._version.readResource(
        this._options['match-target']
          ? URIs.HOSTNAME_COVERAGE_MATCH_TARGET
          : URIs.HOSTNAME_COVERAGE_OVERLAPPING,
        [this._options['host']]
      );
    } else {
      return this._edge.get(URIs.HOSTNAME_COVERAGE);
    }
  }
}

module.exports = {
  hostnameCoverage: HostnameCoverage
};
