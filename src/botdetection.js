'use strict';

let URIs = require('./constants').URIS;
let Edge =
  process.env.MOCK_AKA_SEC_API === 'true' ? require('../mock/edgeClient') : require('./edgeClient');

class BotDetection {
  constructor(options) {
    this._options = options;
    this._edge = new Edge(options);
  }

  getBotDetectionList() {
    return this._edge.get(URIs.BOT_DETECTIONS, []);
  }

  getBotDetection() {
    return this._edge.get(URIs.BOT_DETECTION, [this._options['bot_detection_id']]);
  }
}

module.exports = {
  botdetection: BotDetection
};
