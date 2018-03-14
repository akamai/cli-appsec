'use strict';

let URIs = require('./constants').URIS;
let Config = require('./configprovider').configProvider;

class CloneHandler {
  constructor(options) {
    this._config = new Config(options);
    this._options = options;
  }

  clone() {
    let version = this._options['version'];
    let payload = { createFromVersion: version, ruleUpdate: false };
    return this._config.createResource(URIs.CLONE, [], payload);
  }
}

module.exports = {
  CloneHandler: CloneHandler
};
