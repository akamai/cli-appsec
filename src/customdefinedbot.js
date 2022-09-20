'use strict';

const untildify = require('untildify');
let fs = require('fs');
let URIs = require('./constants').URIS;
let Version = require('./versionsprovider').versionProvider;

class CustomDefinedBot {
  constructor(options) {
    this._options = options;
    this._version = new Version(options);
  }

  getCustomDefinedBotList() {
    return this._version.readResource(URIs.CUSTOM_DEFINED_BOTS, []);
  }

  addCustomDefinedBot() {
    if (fs.existsSync(untildify(this._options['file']))) {
      let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
      let data;
      try {
        data = JSON.parse(payload);
      } catch (err) {
        throw 'The input JSON is not valid';
      }
      return this._version.createResource(URIs.CUSTOM_DEFINED_BOTS, [], data);
    } else {
      throw `The file does not exists: ${this._options['file']}`;
    }
  }

  getCustomDefinedBot() {
    return this._version.readResource(URIs.CUSTOM_DEFINED_BOT, [
      this._options['custom_defined_bot_id']
    ]);
  }

  updateCustomDefinedBot() {
    if (fs.existsSync(untildify(this._options['file']))) {
      let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
      let data;
      try {
        data = JSON.parse(payload);
      } catch (err) {
        throw 'The input JSON is not valid';
      }
      return this._version.updateResource(
        URIs.CUSTOM_DEFINED_BOT,
        [this._options['custom_defined_bot_id']],
        data
      );
    } else {
      throw `The file does not exists: ${this._options['file']}`;
    }
  }

  deleteCustomDefinedBot() {
    return this._version.deleteResource(URIs.CUSTOM_DEFINED_BOT, [
      this._options['custom_defined_bot_id']
    ]);
  }
}

module.exports = {
  customdefinedbot: CustomDefinedBot
};
