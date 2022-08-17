'use strict';

let URIs = require('./constants').URIS;
let Version = require('./versionsprovider').versionProvider;

class ResponseActions {
  constructor(options) {
    this._options = options;
    this._version = new Version(options);
  }

  getResponseActionsList() {
    return this._version.readResource(URIs.RESPONSE_ACTIONS, []);
  }
}

module.exports = {
  responseactions: ResponseActions
};
