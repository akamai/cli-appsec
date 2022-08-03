'use strict';

const untildify = require('untildify');
let fs = require('fs');
let URIs = require('./constants').URIS;
let Policy = require('./policy').policy;

class BotDetectionAction {
  constructor(options) {
    this._options = options;
    this._policy = new Policy(options);
  }

  getBotDetectionActionList() {
    return this._policy.readResource(URIs.BOT_DETECTION_ACTIONS, []);
  }

  getBotDetectionAction() {
    return this._policy.readResource(URIs.BOT_DETECTION_ACTION, [
      this._options['bot_detection_id']
    ]);
  }

  updateBotDetectionAction() {
    if (fs.existsSync(untildify(this._options['file']))) {
      let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
      let data;
      try {
        data = JSON.parse(payload);
      } catch (err) {
        throw 'The input JSON is not valid';
      }
      return this._policy.updateResource(
        URIs.BOT_DETECTION_ACTION,
        [this._options['bot_detection_id']],
        data
      );
    } else {
      throw `The file does not exists: ${this._options['file']}`;
    }
  }
}

module.exports = {
  botdetectionaction: BotDetectionAction
};
