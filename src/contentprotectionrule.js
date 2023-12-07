'use strict';

const untildify = require('untildify');
let fs = require('fs');
let URIs = require('./constants').URIS;
let Policy = require('./policy').policy;

class ContentProtectionRule {
  constructor(options) {
    this._options = options;
    this._policy = new Policy(options);
  }

  getContentProtectionRuleList() {
    return this._policy.readResource(URIs.CONTENT_PROTECTION_RULES, []);
  }

  addContentProtectionRule() {
    if (fs.existsSync(untildify(this._options['file']))) {
      let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
      let data;
      try {
        data = JSON.parse(payload);
      } catch (err) {
        throw 'The input JSON is not valid';
      }
      return this._policy.createResource(URIs.CONTENT_PROTECTION_RULES, [], data);
    } else {
      throw `The file does not exists: ${this._options['file']}`;
    }
  }

  getContentProtectionRule() {
    return this._policy.readResource(URIs.CONTENT_PROTECTION_RULE, [this._options['rule_id']]);
  }

  updateContentProtectionRule() {
    if (fs.existsSync(untildify(this._options['file']))) {
      let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
      let data;
      try {
        data = JSON.parse(payload);
      } catch (err) {
        throw 'The input JSON is not valid';
      }
      return this._policy.updateResource(
        URIs.CONTENT_PROTECTION_RULE,
        [this._options['rule_id']],
        data
      );
    } else {
      throw `The file does not exists: ${this._options['file']}`;
    }
  }

  deleteContentProtectionRule() {
    return this._policy.deleteResource(URIs.CONTENT_PROTECTION_RULE, [this._options['rule_id']]);
  }

  getContentProtectionRuleDetections() {
    return this._policy.readResource(URIs.CONTENT_PROTECTION_RULE_DETECTIONS, []);
  }

  getContentProtectionRuleDetectionSettings() {
    return this._policy.readResource(URIs.CONTENT_PROTECTION_RULE_DETECTION_SETTINGS, [
      this._options['rule_id']
    ]);
  }

  updateContentProtectionRuleDetectionSettings() {
    if (fs.existsSync(untildify(this._options['file']))) {
      let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
      let data;
      try {
        data = JSON.parse(payload);
      } catch (err) {
        throw 'The input JSON is not valid';
      }
      return this._policy.updateResource(
        URIs.CONTENT_PROTECTION_RULE_DETECTION_SETTINGS,
        [this._options['rule_id']],
        data
      );
    } else {
      throw `The file does not exists: ${this._options['file']}`;
    }
  }
}

module.exports = {
  contentProtectionRule: ContentProtectionRule
};
