'use strict';

const untildify = require('untildify');
let fs = require('fs');
let URIs = require('./constants').URIS;
let Version = require('./versionsprovider').versionProvider;

class ChallengeAction {
  constructor(options) {
    this._options = options;
    this._version = new Version(options);
  }

  getChallengeActionList() {
    return this._version.readResource(URIs.CHALLENGE_ACTIONS, []);
  }

  addChallengeAction() {
    if (fs.existsSync(untildify(this._options['file']))) {
      let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
      let data;
      try {
        data = JSON.parse(payload);
      } catch (err) {
        throw 'The input JSON is not valid';
      }
      return this._version.createResource(URIs.CHALLENGE_ACTIONS, [], data);
    } else {
      throw `The file does not exists: ${this._options['file']}`;
    }
  }

  getChallengeAction() {
    return this._version.readResource(URIs.CHALLENGE_ACTION, [this._options['action_id']]);
  }

  updateChallengeAction() {
    if (fs.existsSync(untildify(this._options['file']))) {
      let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
      let data;
      try {
        data = JSON.parse(payload);
      } catch (err) {
        throw 'The input JSON is not valid';
      }
      return this._version.updateResource(
        URIs.CHALLENGE_ACTION,
        [this._options['action_id']],
        data
      );
    } else {
      throw `The file does not exists: ${this._options['file']}`;
    }
  }

  deleteChallengeAction() {
    return this._version.deleteResource(URIs.CHALLENGE_ACTION, [this._options['action_id']]);
  }
}

module.exports = {
  challengeaction: ChallengeAction
};
