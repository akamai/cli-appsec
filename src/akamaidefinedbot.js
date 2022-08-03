'use strict';

let URIs = require('./constants').URIS;
let Edge =
  process.env.MOCK_AKA_SEC_API === 'true' ? require('../mock/edgeClient') : require('./edgeClient');

class AkamaiDefinedBot {
  constructor(options) {
    this._options = options;
    this._edge = new Edge(options);
  }

  getAkamaiDefinedBotList() {
    return this._edge.get(URIs.AKAMAI_DEFINED_BOTS, []);
  }

  getAkamaiDefinedBot() {
    return this._edge.get(URIs.AKAMAI_DEFINED_BOT, [this._options['bot_id']]);
  }
}

module.exports = {
  akamaidefinedbot: AkamaiDefinedBot
};
