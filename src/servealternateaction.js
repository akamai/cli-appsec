'use strict';

const untildify = require('untildify');
let fs = require('fs');
let URIs = require('./constants').URIS;
let Version = require('./versionsprovider').versionProvider;

class ServeAlternateAction {
  constructor(options) {
    this._options = options;
    this._version = new Version(options);
  }

  getServeAlternateActionList() {
    return this._version.readResource(URIs.SERVE_ALTERNATE_ACTIONS, []);
  }

  addServeAlternateAction() {
    if (fs.existsSync(untildify(this._options['file']))) {
      let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
      let data;
      try {
        data = JSON.parse(payload);
      } catch (err) {
        throw 'The input JSON is not valid';
      }
      return this._version.createResource(URIs.SERVE_ALTERNATE_ACTIONS, [], data);
    } else {
      throw `The file does not exists: ${this._options['file']}`;
    }
  }

  getServeAlternateAction() {
    return this._version.readResource(URIs.SERVE_ALTERNATE_ACTION, [this._options['action_id']]);
  }

  updateServeAlternateAction() {
    if (fs.existsSync(untildify(this._options['file']))) {
      let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
      let data;
      try {
        data = JSON.parse(payload);
      } catch (err) {
        throw 'The input JSON is not valid';
      }
      return this._version.updateResource(
        URIs.SERVE_ALTERNATE_ACTION,
        [this._options['action_id']],
        data
      );
    } else {
      throw `The file does not exists: ${this._options['file']}`;
    }
  }

  deleteServeAlternateAction() {
    return this._version.deleteResource(URIs.SERVE_ALTERNATE_ACTION, [this._options['action_id']]);
  }
}

module.exports = {
  servealternateaction: ServeAlternateAction
};
