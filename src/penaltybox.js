'use strict';

let URIs = require('./constants').URIS;
//needed to pass files to PUT/POST
let fs = require('fs');
//Ensures user can add paths like '~/foo'
let untildify = require('untildify');
let Config = require('./configprovider').configProvider;
let Version = require('./versionsprovider').versionProvider;
let PolicyProvider = require('./policy').policy;

class PenaltyBox {
  constructor(options) {
    this._config = new Config(options);
    this._options = options;
    this._version = new Version(options);
    this._policyProvider = new PolicyProvider(options);
  }

  getPenaltyBox() {
    return this._version.readResource(URIs.PENALTY_BOX, [this._options['policy']]);
  }

  enablePenaltyBox() {
    let protection = JSON.parse(
      fs.readFileSync(__dirname + '/../templates/penalty-box.json', 'utf8')
    );
    protection.action = this._options['action'];
    protection.penaltyBoxProtection = true;
    return this._version.updateResource(URIs.PENALTY_BOX, [this._options['policy']], protection);
  }

  disablePenaltyBox() {
    let protection = JSON.parse(
      fs.readFileSync(__dirname + '/../templates/penalty-box.json', 'utf8')
    );

    return this._version.updateResource(URIs.PENALTY_BOX, [this._options['policy']], protection);
  }
}

module.exports = {
  penaltyBox: PenaltyBox
};
