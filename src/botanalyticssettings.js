'use strict';

const untildify = require('untildify');
let fs = require('fs');
let URIs = require('./constants').URIS;
let Version = require('./versionsprovider').versionProvider;

class BotAnalyticsSettings {
  constructor(options) {
    this._options = options;
    this._version = new Version(options);
  }

  getBotAnalyticsSettings() {
    return this._version.readResource(URIs.BOT_ANALYTICS_SETTINGS, []);
  }

  updateBotAnalyticsSettings() {
    if (fs.existsSync(untildify(this._options['file']))) {
      let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
      let data;
      try {
        data = JSON.parse(payload);
      } catch (err) {
        throw 'The input JSON is not valid';
      }
      return this._version.updateResource(URIs.BOT_ANALYTICS_SETTINGS, [], data);
    } else {
      throw `The file does not exists: ${this._options['file']}`;
    }
  }
}

module.exports = {
  botanalyticssettings: BotAnalyticsSettings
};
