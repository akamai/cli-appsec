'use strict';

const untildify = require('untildify');
let fs = require('fs');
let URIs = require('./constants').URIS;
let Policy = require('./policy').policy;

class ContentProtectionJavaScriptInjectionRule {
  constructor(options) {
    this._options = options;
    this._policy = new Policy(options);
  }

  getContentProtectionJavaScriptInjectionRules() {
    return this._policy.readResource(URIs.CONTENT_PROTECTION_JS_INJECTION_RULES, []);
  }

  addContentProtectionJavaScriptInjectionRule() {
    if (fs.existsSync(untildify(this._options['file']))) {
      let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
      let data;
      try {
        data = JSON.parse(payload);
      } catch (err) {
        throw 'The input JSON is not valid';
      }
      return this._policy.createResource(URIs.CONTENT_PROTECTION_JS_INJECTION_RULES, [], data);
    } else {
      throw `The file does not exists: ${this._options['file']}`;
    }
  }

  getContentProtectionJavaScriptInjectionRule() {
    return this._policy.readResource(URIs.CONTENT_PROTECTION_JS_INJECTION_RULE, [
      this._options['rule_id']
    ]);
  }

  updateContentProtectionJavaScriptInjectionRule() {
    if (fs.existsSync(untildify(this._options['file']))) {
      let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
      let data;
      try {
        data = JSON.parse(payload);
      } catch (err) {
        throw 'The input JSON is not valid';
      }
      return this._policy.updateResource(
        URIs.CONTENT_PROTECTION_JS_INJECTION_RULE,
        [this._options['rule_id']],
        data
      );
    } else {
      throw `The file does not exists: ${this._options['file']}`;
    }
  }

  deleteContentProtectionJavaScriptInjectionRule() {
    return this._policy.deleteResource(URIs.CONTENT_PROTECTION_JS_INJECTION_RULE, [
      this._options['rule_id']
    ]);
  }
}

module.exports = {
  contentProtectionJavaScriptInjectionRule: ContentProtectionJavaScriptInjectionRule
};
