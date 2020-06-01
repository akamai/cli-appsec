'use strict';

let URIs = require('./constants').URIS;
//Ensures user can add paths like '~/foo'
let Version = require('./versionsprovider').versionProvider;

class Mode {
  constructor(options) {
    this._options = options;
    this._version = new Version(options);
  }

  setMode() {
    let payload = { mode: this._options.mode };
    return this._version.updateResource(URIs.MODE, [this._options['policy']], payload);
  }
}

module.exports = {
  mode: Mode
};
