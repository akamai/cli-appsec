'use strict';

const untildify = require('untildify');
let fs = require('fs');
let URIs = require('./constants').URIS;
let Version = require('./versionsprovider').versionProvider;

class RecategorizedAkamaiDefinedBot {
  constructor(options) {
    this._options = options;
    this._version = new Version(options);
  }

  getRecategorizedAkamaiDefinedBotList() {
    return this._version.readResource(URIs.RECATEGORIZED_AKAMAI_DEFINED_BOTS, []);
  }

  addRecategorizedAkamaiDefinedBot() {
    if (fs.existsSync(untildify(this._options['file']))) {
      let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
      let data;
      try {
        data = JSON.parse(payload);
      } catch (err) {
        throw 'The input JSON is not valid';
      }
      return this._version.createResource(URIs.RECATEGORIZED_AKAMAI_DEFINED_BOTS, [], data);
    } else {
      throw `The file does not exists: ${this._options['file']}`;
    }
  }

  getRecategorizedAkamaiDefinedBot() {
    return this._version.readResource(URIs.RECATEGORIZED_AKAMAI_DEFINED_BOT, [
      this._options['akamai_defined_bot_id']
    ]);
  }

  updateRecategorizedAkamaiDefinedBot() {
    if (fs.existsSync(untildify(this._options['file']))) {
      let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
      let data;
      try {
        data = JSON.parse(payload);
      } catch (err) {
        throw 'The input JSON is not valid';
      }
      return this._version.updateResource(
        URIs.RECATEGORIZED_AKAMAI_DEFINED_BOT,
        [this._options['akamai_defined_bot_id']],
        data
      );
    } else {
      throw `The file does not exists: ${this._options['file']}`;
    }
  }

  deleteRecategorizedAkamaiDefinedBot() {
    return this._version.deleteResource(URIs.RECATEGORIZED_AKAMAI_DEFINED_BOT, [
      this._options['akamai_defined_bot_id']
    ]);
  }
}

module.exports = {
  recategorizedakamaidefinedbot: RecategorizedAkamaiDefinedBot
};
