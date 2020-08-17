'use strict';

let URIs = require('./constants').URIS;
//needed to pass files to PUT/POST
let fs = require('fs');
//Ensures user can add paths like '~/foo'
let untildify = require('untildify');
let Config = require('./configprovider').configProvider;
let Version = require('./versionsprovider').versionProvider;
let PolicyProvider = require('./policy').policy;
class ReputationProfile {
  constructor(options) {
    this._config = new Config(options);
    this._options = options;
    this._version = new Version(options);
    this._policyProvider = new PolicyProvider(options);
  }

  getAllReputationProfiles() {
    return this._version.readResource(URIs.REPUTATION_PROFILES, []);
  }

  getReputationProfile() {
    return this._version.readResource(URIs.REPUTATION_PROFILE, [
      this._options['reputation-profile']
    ]);
  }

  deleteReputationProfile() {
    return this._version.deleteResource(URIs.REPUTATION_PROFILE, [
      this._options['reputation-profile']
    ]);
  }

  createReputationProfile() {
    if (fs.existsSync(this._options['file'])) {
      let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
      let data;
      try {
        data = JSON.parse(payload);
      } catch (err) {
        throw 'The input JSON is not valid';
      }
      return this._version.createResource(URIs.REPUTATION_PROFILES, [], data);
    } else {
      throw `The file does not exists: ${this._options['file']}`;
    }
  }

  updateReputationProfile() {
    if (fs.existsSync(this._options['file'])) {
      let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
      let data;
      try {
        data = JSON.parse(payload);
      } catch (err) {
        throw 'The input JSON is not valid';
      }
      return this._version.updateResource(
        URIs.REPUTATION_PROFILE,
        [this._options['reputation-profile']],
        data
      );
    } else {
      throw `The file does not exists: ${this._options['file']}`;
    }
  }
}
module.exports = {
  reputationProfile: ReputationProfile
};
