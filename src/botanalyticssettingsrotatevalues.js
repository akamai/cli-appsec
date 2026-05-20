'use strict';

let URIs = require('./constants').URIS;
let Edge =
  process.env.MOCK_AKA_SEC_API === 'true' ? require('../mock/edgeClient') : require('./edgeClient');

class BotAnalyticsSettingsRotateValues {
  constructor(options) {
    this._options = options;
    this._edge = new Edge(options);
  }

  rotateBotAnalyticsSettingsValues() {
    return this._edge.post(URIs.BOT_ANALYTICS_SETTINGS_ROTATE_VALUES, []);
  }
}

module.exports = {
  botanalyticssettingsrotatevalues: BotAnalyticsSettingsRotateValues
};
