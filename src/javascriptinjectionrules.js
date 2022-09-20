'use strict';

const untildify = require('untildify');
let fs = require('fs');
let URIs = require('./constants').URIS;
let Policy = require('./policy').policy;

class JavascriptInjectionRules {
  constructor(options) {
    this._options = options;
    this._policy = new Policy(options);
  }

  getJavascriptInjectionRules() {
    return this._policy.readResource(URIs.JAVA_SCRIPT_INJECTION_RULES, []);
  }

  updateJavascriptInjectionRules() {
    if (fs.existsSync(untildify(this._options['file']))) {
      let payload = fs.readFileSync(untildify(this._options['file']), 'utf8');
      let data;
      try {
        data = JSON.parse(payload);
      } catch (err) {
        throw 'The input JSON is not valid';
      }
      return this._policy.updateResource(URIs.JAVA_SCRIPT_INJECTION_RULES, [], data);
    } else {
      throw `The file does not exists: ${this._options['file']}`;
    }
  }
}

module.exports = {
  javascriptinjectionrules: JavascriptInjectionRules
};
