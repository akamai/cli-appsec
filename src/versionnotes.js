'use strict';

let URIs = require('./constants').URIS;
let fs = require('fs');
let Config = require('./configprovider').configProvider;
let Version = require('./versionsprovider').versionProvider;

class VersionNotes {
  constructor(options) {
    this._config = new Config(options);
    this._options = options;
    this._version = new Version(options);
  }

  getVersionNotes() {
    return this._version.readResource(URIs.VERSION_NOTES, []);
  }

  updateVersionNotes() {
    let json = JSON.parse(fs.readFileSync(__dirname + '/../templates/versionNotes.json', 'utf8'));
    json.notes = this._options['notes'];
    return this._version.updateResource(URIs.VERSION_NOTES, [], json);
  }
}

module.exports = {
  versionNotes: VersionNotes
};
