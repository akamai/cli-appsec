'use strict';

let URIs = require('./constants').URIS;
//let logger = require('./constants').logger('Export');
let Version = require('./versionsprovider').versionProvider;

class Export {
  constructor(options) {
    this._version = new Version(options);
    this._options = JSON.parse(JSON.stringify(options));
  }

  export() {
    return this._version.readResource(URIs.EXPORT, []);
  }
}

module.exports = {
  export: Export
};
