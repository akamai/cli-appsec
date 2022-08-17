'use strict';

const untildify = require('untildify');
let fs = require('fs');
let URIs = require('./constants').URIS;
let Version = require('./versionsprovider').versionProvider;
let Edge =
  process.env.MOCK_AKA_SEC_API === 'true' ? require('../mock/edgeClient') : require('./edgeClient');

class BotEndpointCoverageReport {
  constructor(options) {
    this._options = options;
    this._edge = new Edge(options);
    this._version = new Version(options);
  }

  getBotEndpointCoverageReport() {
    return this._edge.get(URIs.BOT_ENDPOINT_COVERAGE_REPORTS, []);
  }

  getBotEndpointCoverageReportConfigVersion() {
    return this._version.readResource(URIs.BOT_ENDPOINT_COVERAGE_REPORT, []);
  }
}

module.exports = {
  botendpointcoveragereport: BotEndpointCoverageReport
};
