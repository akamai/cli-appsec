'use strict';

let URIs = require('./constants').URIS;
let Edge =
  process.env.MOCK_AKA_SEC_API === 'true' ? require('../mock/edgeClient') : require('./edgeClient');

class BotAnalyticsCookieRotateValues {
  constructor(options) {
    this._options = options;
    this._edge = new Edge(options);
  }

  rotateBotAnalyticsCookieValues() {
    return this._edge.post(URIs.BOT_ANALYTICS_COOKIE_ROTATE_VALUES, []);
  }
}

module.exports = {
  botanalyticscookierotatevalues: BotAnalyticsCookieRotateValues
};
