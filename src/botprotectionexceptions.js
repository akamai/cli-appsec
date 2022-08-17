'use strict';

const untildify = require('untildify');
let fs = require('fs');
let URIs = require('./constants').URIS;
let Policy = require('./policy').policy;

class BotProtectionExceptions {
  constructor(options) {
    this._options = options;
    this._policy = new Policy(options);
  }

  getBotProtectionExceptions() {
    return this._policy.readResource(URIs.BOT_PROTECTION_EXCEPTIONS, []);
  }

  updateBotProtectionExceptions() {
    if (fs.existsSync(untildify(this._options['file']))) {
      let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
      let data;
      try {
        data = JSON.parse(payload);
      } catch (err) {
        throw 'The input JSON is not valid';
      }
      return this._policy.updateResource(URIs.BOT_PROTECTION_EXCEPTIONS, [], data);
    } else {
      throw `The file does not exists: ${this._options['file']}`;
    }
  }
}

module.exports = {
  botprotectionexceptions: BotProtectionExceptions
};
