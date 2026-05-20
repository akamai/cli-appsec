'use strict';

let URIs = require('./constants').URIS;
let Edge =
  process.env.MOCK_AKA_SEC_API === 'true' ? require('../mock/edgeClient') : require('./edgeClient');

class BotAnalyticsSettingsValues {
  constructor(options) {
    this._options = options;
    this._edge = new Edge(options);
  }

  getBotAnalyticsSettingsValues() {
    return this._edge.get(URIs.BOT_ANALYTICS_SETTINGS_VALUES, []);
  }
}

module.exports = {
  botanalyticssettingsvalues: BotAnalyticsSettingsValues
};
