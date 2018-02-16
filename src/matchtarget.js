'use strict';

let URIs = require('./constants').URIS;
let logger = require('./constants').logger('HostSelection');
let Version = require('./versionsprovider').versionProvider;
let fs = require('fs');
const TEMPLATE_PATH = __dirname + '/../templates/matchtarget.json';

class MatchTarget {
  constructor(options) {
    this._version = new Version(options);
    this._options = JSON.parse(JSON.stringify(options)); //clone
    this._matchTarget = JSON.parse(fs.readFileSync(TEMPLATE_PATH, 'utf8'));
  }

  createMatchTarget() {
    this._matchTarget.firewallPolicy.policyId = this._options.policy;
    this._matchTarget.hostnames = this._options.hostnames;
    this._matchTarget.filePaths = this._options.paths;

    return this._version.createResource(URIs.MATCH_TARGETS, [], this._matchTarget);
  }
}

module.exports = {
  matchTarget: MatchTarget
};
