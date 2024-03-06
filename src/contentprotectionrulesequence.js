'use strict';

const untildify = require('untildify');
let fs = require('fs');
let URIs = require('./constants').URIS;
let Policy = require('./policy').policy;

class ContentProtectionRuleSequence {
  constructor(options) {
    this._options = options;
    this._policy = new Policy(options);
  }

  getContentProtectionRuleSequence() {
    return this._policy.readResource(URIs.CONTENT_PROTECTION_RULE_SEQUENCE, []);
  }

  updateContentProtectionRuleSequence() {
    if (fs.existsSync(untildify(this._options['file']))) {
      let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
      let data;
      try {
        data = JSON.parse(payload);
      } catch (err) {
        throw 'The input JSON is not valid';
      }
      return this._policy.updateResource(URIs.CONTENT_PROTECTION_RULE_SEQUENCE, [], data);
    } else {
      throw `The file does not exists: ${this._options['file']}`;
    }
  }
}

module.exports = {
  contentProtectionRuleSequence: ContentProtectionRuleSequence
};
