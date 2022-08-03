'use strict';

const untildify = require('untildify');
let fs = require('fs');
let URIs = require('./constants').URIS;
let Version = require('./versionsprovider').versionProvider;

class ConditionalAction {
  constructor(options) {
    this._options = options;
    this._version = new Version(options);
  }

  getConditionalActionList() {
    return this._version.readResource(URIs.CONDITIONAL_ACTIONS, []);
  }

  addConditionalAction() {
    if (fs.existsSync(untildify(this._options['file']))) {
      let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
      let data;
      try {
        data = JSON.parse(payload);
      } catch (err) {
        throw 'The input JSON is not valid';
      }
      return this._version.createResource(URIs.CONDITIONAL_ACTIONS, [], data);
    } else {
      throw `The file does not exists: ${this._options['file']}`;
    }
  }

  getConditionalAction() {
    return this._version.readResource(URIs.CONDITIONAL_ACTION, [this._options['action_id']]);
  }

  updateConditionalAction() {
    if (fs.existsSync(untildify(this._options['file']))) {
      let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
      let data;
      try {
        data = JSON.parse(payload);
      } catch (err) {
        throw 'The input JSON is not valid';
      }
      return this._version.updateResource(
        URIs.CONDITIONAL_ACTION,
        [this._options['action_id']],
        data
      );
    } else {
      throw `The file does not exists: ${this._options['file']}`;
    }
  }

  deleteConditionalAction() {
    return this._version.deleteResource(URIs.CONDITIONAL_ACTION, [this._options['action_id']]);
  }
}

module.exports = {
  conditionalaction: ConditionalAction
};
